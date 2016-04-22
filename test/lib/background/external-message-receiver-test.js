import { _, assert, sinon } from "../../common";
import ExternalMessageReceiver from "../../../app/scripts/lib/background/external-message-receiver";

describe("ExternalMessageReceiver", () => {
  let controller;
  let receiver;

  const messagePublishNovel = {
    type: "PUBLISH_NOVEL",
    close: true,
    pubs: [
      {
        title: "Test title",
        body: "Test body",
        time: "2016-03-28T18:00:00+0900",
        sites: {
          narou: { novelId: "12345" },
          kakuyomu: { novelId: "1234567890" },
        },
      },
    ],
  };

  const sender = {
    tab: { id: 123 },
  };

  beforeEach(() => {
    controller = {
      publishNovel: sinon.spy(() => Promise.resolve()),
    };
    receiver = new ExternalMessageReceiver(controller);
  });

  it("new ExternalMessageReceiver", () => {
    assert(receiver instanceof ExternalMessageReceiver);
  });

  describe("#register", () => {
    it("registers handler to onMessageExternal", () => {
      receiver.register();
      assert(chrome.runtime.onMessageExternal.addListener.called);
    });
  });

  context("on PUBLISH_NOVEL", () => {
    it("publishes novel", (done) => {
      const message = messagePublishNovel;
      receiver.register();

      chrome.runtime.onMessageExternal.trigger(message, sender, () => {
        assert(controller.publishNovel.calledOnce);
        assert(controller.publishNovel.args[0][0] === message.pubs);

        assert(chrome.tabs.remove.calledOnce);
        assert(chrome.tabs.remove.args[0][0] === sender.tab.id);

        done();
      });
    });

    it("closes tab with close = false", (done) => {
      receiver.register();

      const message = _.defaults({ close: false }, messagePublishNovel);
      chrome.runtime.onMessageExternal.trigger(message, sender, () => {
        assert(!chrome.tabs.remove.calledOnce);
        done();
      });
    });
  });
});
