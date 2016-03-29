import externalEvents from "./external-events";
import Publisher from "../publications/publisher";
import Options from "../app/options";

export default function () {
  let publisher;

  function loadOptions(options) {
    publisher = new Publisher(options);
  }

  Options.load().then(options => {
    loadOptions(options);
    options.observeUpdate(loadOptions);
  });

  const externalHandler = externalEvents.buildHandler((e) => ({
    [e.PUBLISH_NOVEL](message, sender) {
      return publisher && publisher.publishAll(message.pubs).then(() => {
        if (message.close && sender.tab) {
          chrome.tabs.remove(sender.tab.id);
        }
      });
    },
  }));
  chrome.runtime.onMessageExternal.addListener(externalHandler);
}
