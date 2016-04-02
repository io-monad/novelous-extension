import externalEvents from "./external-events";
import Subscriber from "../subscriptions/subscriber";
import Publisher from "../publications/publisher";
import AppOptions from "../app/app-options";
import ChromeAlarm from "../util/chrome-alarm";

export default function () {
  const logger = debug("background");
  const subscriberAlarm = new ChromeAlarm("subscriber");
  let appOptions;
  let subscriber;
  let publisher;

  logger("Initializing");
  AppOptions.load().then((opts) => {
    logger("Loaded AppOptions successfully", opts.options);
    appOptions = opts;
    appOptions.on("update", handleAppOptionUpdate);
    handleAppOptionUpdate();
  });

  function handleAppOptionUpdate() {
    logger("Updating with new AppOptions", appOptions.options);

    subscriber = new Subscriber(appOptions.sites, {
      subscriptions: appOptions.subscriptions,
    });
    publisher = new Publisher(appOptions.sites);

    subscriberAlarm.start({
      when: appOptions.nextWillUpdateAt,
      periodInMinutes: appOptions.updatePeriodMinutes,
    });
  }

  subscriberAlarm.on("alarm", () => {
    logger("Starting subscriber.updateAll");

    subscriber.updateAll().then(() => {
      logger("Finished subscriber.updateAll successfully");

      appOptions.lastUpdatedAt = _.now();
      appOptions.subscriptions = subscriber.subscriptions;

      appOptions.save().then(() => {
        logger("Saved updated AppOptions successfully", appOptions.options);
      })
      .catch((e) => {
        console.error("Error on saving AppOptions:", e);
      });
    })
    .catch((e) => {
      console.error("Error in subscriber.updateAll:", e);
    });
  });

  chrome.runtime.onMessageExternal.addListener(
    externalEvents.buildHandler(e => ({
      [e.PUBLISH_NOVEL](message, sender) {
        logger("Publishing novel", "message:", message);
        return publisher && publisher.publishAll(message.pubs).then(() => {
          if (message.close && sender.tab) {
            chrome.tabs.remove(sender.tab.id);
          }
        });
      },
    }))
  );
}
