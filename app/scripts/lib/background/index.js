import externalEvents from "./external-events";
import SiteFactory from "../sites/site-factory";
import Subscriber from "../subscriptions/subscriber";
import Subscription from "../subscriptions/subscription";
import Publisher from "../publications/publisher";
import Options from "../app/options";
import ChromeAlarm from "../util/chrome-alarm";

export default function () {
  const logger = debug("background");
  const subscriberAlarm = new ChromeAlarm("subscriber");
  let appOptions;
  let subscriber;
  let publisher;

  logger("Initializing");
  Options.load().then((opts) => {
    logger("Loaded AppOptions successfully", opts.options);
    appOptions = opts;
    appOptions.on("update", handleAppOptionUpdate);
    handleAppOptionUpdate();
  });

  function handleAppOptionUpdate() {
    logger("Updating with new AppOptions", appOptions.options);

    const sites = SiteFactory.createMap(appOptions.siteSettings);
    const subscriptions = _.map(appOptions.subscriptionSettings, sub => new Subscription(sub));
    subscriber = new Subscriber(sites, { subscriptions });
    publisher = new Publisher(sites);

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
      appOptions.subscriptionSettings =
        _.invokeMap(subscriber.subscriptions, "toObject");

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
