import { MessageReceiver } from "@io-monad/chrome-util";

export default class BackgroundExternalMessageReceiver {
  constructor(controller) {
    this.controller = controller;
    this.receiver = new MessageReceiver({
      PUBLISH_NOVEL: this.handlePublishNovel,
    }, this);
  }

  register() {
    chrome.runtime.onMessageExternal.addListener(this.receiver.listener);
  }

  handlePublishNovel(message, sender) {
    return this.controller.publishNovel(message.pubs).then(() => {
      if (message.close && sender.tab) {
        chrome.tabs.remove(sender.tab.id);
      }
    });
  }
}
