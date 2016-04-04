import externalEvents from "./external-events";
import Subscriber from "../subscriptions/subscriber";
import Watcher from "../watchers/watcher";
import Publisher from "../publications/publisher";
import AppData from "../app/app-data";
import ChromeAlarm from "../util/chrome-alarm";
import Badge from "./badge";

export default function () {
  const logger = debug("background");
  const subscriberAlarm = new ChromeAlarm("subscriber");
  const badge = new Badge();
  const appData = new AppData();
  let subscriber;
  let watcher;
  let publisher;

  logger("Initializing");
  const initialized = new Promise((resolve, reject) => {
    appData.on("update", (data, keys) => {
      const updated = _.keyBy(keys);
      if (updated.sites) setupPublisher();
      if (updated.subscriptions) setupSubscriber();
      if (updated.watchSettings) setupWatcher();

      subscriberAlarm.start({
        when: appData.nextWillUpdateAt,
        periodInMinutes: appData.updatePeriodMinutes,
      });
    });
    appData.load().then(resolve, reject);
  })
  .catch((e) => {
    console.error("Error while initialization", e);
  });

  function setupPublisher() {
    if (publisher) {
      publisher.sites = appData.sites;
      logger("Updated Publisher", publisher);
    } else {
      publisher = new Publisher(appData.sites);
      logger("Initialized Publisher", publisher);
    }
  }

  function setupSubscriber() {
    if (subscriber) {
      subscriber.subscriptions = appData.subscriptions;
      logger("Updated Subscriber", subscriber);
    } else {
      subscriber = new Subscriber(appData.sites, appData.subscriptions);

      subscriber.on("updateSubscription", (subscription) => {
        watcher.notifyUpdate(subscription.id, subscription.item);
      });
      logger("Initialized Subscriber", subscriber);
    }
  }

  function setupWatcher() {
    if (watcher) {
      watcher.settings = appData.watchSettings;
      logger("Updated Watcher", watcher);
    } else {
      watcher = new Watcher(appData.watchSettings);

      // Set counts from last session
      _.each(watcher.getCounts(), (count, id) => badge.setCount(id, count));

      const appDataSave = _.debounce(() => appData.save(["watchSettings"]), 3000);
      const appDataChange = () => {
        appData.watchSettings = watcher.settings;
        appDataSave();
      };
      watcher.on("update", ({ id, count }) => {
        appDataChange();
        badge.setCount(id, count);
      });
      watcher.on("seen", ({ id }) => {
        appDataChange();
        badge.setCount(id, 0);
      });
      watcher.on("seenAll", () => {
        appDataChange();
        badge.clear();
      });
      logger("Initialized Watcher", watcher);
    }
  }

  subscriberAlarm.on("alarm", () => initialized.then(() => {
    logger("Starting subscriber.updateAll");

    subscriber.updateAll()
    .then(() => {
      logger("Finished subscriber.updateAll successfully");

      appData.lastUpdatedAt = _.now();
      appData.subscriptions = subscriber.subscriptions;
      appData.save(["lastUpdatedAt", "subscriptions"]);
    })
    .catch((e) => {
      console.error("Error in subscriber.updateAll:", e);
    });
  }));

  chrome.runtime.onMessageExternal.addListener(
    externalEvents.buildHandler(e => ({
      [e.PUBLISH_NOVEL]: (message, sender) => initialized.then(() => {
        logger("Publishing novel", "message:", message);
        return publisher.publishAll(message.pubs).then(() => {
          if (message.close && sender.tab) {
            chrome.tabs.remove(sender.tab.id);
          }
        });
      }),
    }))
  );

  return initialized;
}
