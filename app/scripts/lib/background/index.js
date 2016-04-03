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
    appData.on("update", () => {
      setupPublisher();
      setupSubscriber();
      setupWatcher();

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
    } else {
      publisher = new Publisher(appData.sites);
    }
  }

  function setupSubscriber() {
    if (subscriber) {
      subscriber.subscriptions = appData.subscriptions;
    } else {
      subscriber = new Subscriber(appData.sites, appData.subscriptions);

      subscriber.on("updateSubscription", (subscription) => {
        watcher.notifyUpdate(subscription.id, subscription.item);
      });
    }
  }

  function setupWatcher() {
    if (watcher) {
      watcher.settings = appData.watchSettings;
    } else {
      watcher = new Watcher(appData.watchSettings);

      const saveWatcher = _.debounce(() => {
        appData.watchSettings = watcher.settings;
        appData.save(["watchSettings"]);
      }, 3000);
      watcher.on("update", ({ id, count }) => {
        badge.setCount(id, count);
        saveWatcher();
      });
      watcher.on("seen", () => {
        badge.clear();
        saveWatcher();
      });
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
}
