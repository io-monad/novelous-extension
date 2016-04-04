import ChromeMessageReceiver from "../util/chrome-message-receiver";

export default class BackgroundExternalMessageReceiver extends ChromeMessageReceiver {
  static getMessageTypes() {
    return [
      "PUBLISH_NOVEL",
    ];
  }

  _getMessageHandlerMapping(t) {
    return {
      [t.PUBLISH_NOVEL]: this.handlePublishNovel,
    };
  }

  constructor(controller) {
    super("external");
    this.controller = controller;
  }

  register() {
    chrome.runtime.onMessageExternal.addListener(this.listener);
  }

  handlePublishNovel(message, sender) {
    return this.controller.publishNovel(message.pubs).then(() => {
      if (message.close && sender.tab) {
        chrome.tabs.remove(sender.tab.id);
      }
    });
  }
}
