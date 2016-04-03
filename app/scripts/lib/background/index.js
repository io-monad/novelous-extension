import externalEvents from "./external-events";
import Subscriber from "../subscriptions/subscriber";
import Publisher from "../publications/publisher";
import AppData from "../app/app-data";
import ChromeAlarm from "../util/chrome-alarm";

export default function () {
  const logger = debug("background");
  const subscriberAlarm = new ChromeAlarm("subscriber");
  let appData;
  let subscriber;
  let publisher;

  logger("Initializing");
  AppData.load().then((loaded) => {
    logger("Loaded AppData successfully", loaded.data);
    appData = loaded;
    appData.on("update", handleAppDataUpdate);
    handleAppDataUpdate();
  });

  function handleAppDataUpdate() {
    logger("Updating with new AppData", appData.data);

    subscriber = new Subscriber(appData.sites, {
      subscriptions: appData.subscriptions,
    });
    publisher = new Publisher(appData.sites);

    subscriberAlarm.start({
      when: appData.nextWillUpdateAt,
      periodInMinutes: appData.updatePeriodMinutes,
    });
  }

  subscriberAlarm.on("alarm", () => {
    logger("Starting subscriber.updateAll");

    subscriber.updateAll().then(() => {
      logger("Finished subscriber.updateAll successfully");

      appData.lastUpdatedAt = _.now();
      appData.subscriptions = subscriber.subscriptions;

      appData.save().then(() => {
        logger("Saved updated AppData successfully", appData.data);
      })
      .catch((e) => {
        console.error("Error on saving AppData:", e);
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
