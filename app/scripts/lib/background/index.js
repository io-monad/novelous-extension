import externalEvents from "./external-events";
import SiteFactory from "../sites/site-factory";
import Subscriber from "../subscriptions/subscriber";
import Publisher from "../publications/publisher";
import Options from "../app/options";
import ChromeAlarm from "../util/chrome-alarm";
const debug = require("debug")("Background");

export default function () {
  const updateAlarm = new ChromeAlarm("update");
  let subscriber;
  let publisher;

  chrome.runtime.onStartup.addListener(initialize);
  chrome.runtime.onInstalled.addListener(initialize);

  function initialize() {
    Options.load().then(options => {
      loadOptions(options);
      options.observeUpdate(loadOptions);
    });
  }

  function loadOptions(options) {
    const sites = SiteFactory.createMap(options.siteSettings);
    subscriber = new Subscriber(sites, options);
    publisher = new Publisher(sites, options);
    updateAlarm.startImmediate({
      periodInMinutes: options.updatePeriodMinutes,
    });
  }

  updateAlarm.on("alarm", () => {
    debug("Starting subscriber.updateAll");
    subscriber.updateAll().then(() => {
      debug("Finished subscriber.updateAll successfully");
    }).catch((e) => {
      console.error("Error in subscriber.updateAll:", e);
    });
  });

  chrome.runtime.onMessageExternal.addListener(
    externalEvents.buildHandler(e => ({
      [e.PUBLISH_NOVEL](message, sender) {
        return publisher && publisher.publishAll(message.pubs).then(() => {
          if (message.close && sender.tab) {
            chrome.tabs.remove(sender.tab.id);
          }
        });
      },
    }))
  );
}
