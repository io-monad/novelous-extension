import externalEvents from "./external-events";
import Publisher from "../publications/publisher";
import Options from "../app/options";
import ChromeAlarm from "../util/chrome-alarm";

export default function () {
  const updateAlarm = new ChromeAlarm("update");
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
    publisher = new Publisher(options);
    updateAlarm.startImmediate({
      periodInMinutes: options.updateIntervalMinutes,
    });
  }

  updateAlarm.on("alarm", () => {
    console.log("Timer ticked!");
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
