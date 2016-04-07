import { test, sinon } from "../../common";
import ExternalMessageReceiver from "../../../app/scripts/lib/background/external-message-receiver";
const events = ExternalMessageReceiver.getMessageTypeMap();

const messagePublishNovel = {
  type: events.PUBLISH_NOVEL,
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

test.beforeEach(t => {
  t.context.controller = {
    publishNovel: sinon.spy(() => Promise.resolve()),
  };
  t.context.receiver = new ExternalMessageReceiver(t.context.controller);
});

test("new ExternalMessageReceiver", t => {
  const { receiver } = t.context;
  t.truthy(receiver instanceof ExternalMessageReceiver);
});

test.serial("#register registers handler to onMessageExternal", t => {
  const { receiver } = t.context;
  receiver.register();
  t.true(chrome.runtime.onMessageExternal.addListener.called);
});

test.serial.cb("handles PUBLISH_NOVEL", t => {
  const { receiver, controller } = t.context;
  const message = messagePublishNovel;
  receiver.register();

  chrome.runtime.onMessageExternal.trigger(message, sender, () => {
    t.true(controller.publishNovel.calledOnce);
    t.is(controller.publishNovel.args[0][0], message.pubs);

    t.true(chrome.tabs.remove.calledOnce);
    t.is(chrome.tabs.remove.args[0][0], sender.tab.id);

    t.end();
  });
});

test.serial.cb("handles PUBLISH_NOVEL with close = false", t => {
  const { receiver } = t.context;
  receiver.register();

  const message = _.defaults({ close: false }, messagePublishNovel);
  chrome.runtime.onMessageExternal.trigger(message, sender, () => {
    t.false(chrome.tabs.remove.calledOnce);
    t.end();
  });
});
