import { _, assert, sinon, sinonsb, factory } from "../../common";
import SubscriberNotifier from "../../../app/scripts/lib/background/subscriber-notifier";
import Subscriber from "../../../app/scripts/lib/subscriptions/subscriber";
import AppVars from "../../../app/scripts/lib/app/app-vars";

describe("SubscriberNotifier", () => {
  let sound;
  let subscriber;
  let subscription;
  let notifier;

  const realAudio = global.Audio;
  beforeEach(() => {
    sound = { play: sinon.spy() };
    global.Audio = sinon.stub().returns(sound);

    subscriber = new Subscriber([
      factory.buildSync("itemsSubscriptionData"),
    ]);
    subscription = subscriber.subscriptions[0];
    notifier = new SubscriberNotifier(subscriber);

    chrome.notifications.create.callsArgAsync(2);
  });
  afterEach(() => {
    if (realAudio) {
      global.Audio = realAudio;
    } else {
      delete global.Audio;
    }
  });

  it("subscriber update makes notifiactions", () => {
    const notifyItemStub = sinonsb.stub(notifier, "notifyItem");
    subscription._lastFoundItems = subscription.items.slice(0, 2);
    subscriber.emit("update");
    assert(notifyItemStub.calledTwice);
    assert(notifyItemStub.args[0][0] === subscription);
    assert(notifyItemStub.args[0][1] === subscription.items[0]);
    assert(notifyItemStub.args[1][0] === subscription);
    assert(notifyItemStub.args[1][1] === subscription.items[1]);
  });

  describe("#notifyItem", () => {
    it("creates notification", () => {
      const item = subscription.items[0];

      return notifier.notifyItem(subscription, item).then(notified => {
        assert(notified);
        assert(chrome.notifications.create.calledOnce);
        const [notifyId, options] = chrome.notifications.create.args[0];

        assert(_.isString(notifyId));
        assert.deepEqual(options, {
          type: "basic",
          iconUrl: AppVars.iconUrl[128],
          title: `${subscription.siteName}: ${subscription.title}`,
          message: `${item.title}\n${item.authorName}`,
          contextMessage: item.body,
          isClickable: true,
        });

        assert(sound.play.calledOnce);
      });
    });

    it("ignores notified item", () => {
      const item = subscription.items[0];

      return notifier.notifyItem(subscription, item).then(notified => {
        assert(notified);
        assert(chrome.notifications.create.calledOnce);

        return notifier.notifyItem(subscription, item).then(notified2 => {
          assert(!notified2);
          assert(chrome.notifications.create.calledOnce);
        });
      });
    });

    it("ignores disabled subscription", () => {
      const item = subscription.items[0];
      notifier.options.enabledSubscriptionIds[subscription.id] = false;

      return notifier.notifyItem(subscription, item).then(notified => {
        assert(!notified);
        assert(!chrome.notifications.create.calledOnce);
      });
    });

    it("respects alertEnabled setting", () => {
      notifier.options.alertEnabled = false;
      return notifier.notifyItem(subscription, subscription.items[0]).then(notified => {
        assert(notified);
        assert(!chrome.notifications.create.called);
        assert(sound.play.calledOnce);
      });
    });

    it("respects soundEnabled setting", () => {
      notifier.options.soundEnabled = false;
      return notifier.notifyItem(subscription, subscription.items[0]).then(notified => {
        assert(notified);
        assert(chrome.notifications.create.called);
        assert(!sound.play.called);
      });
    });

    it("skips notification if both disabled", () => {
      notifier.options.alertEnabled = false;
      notifier.options.soundEnabled = false;
      return notifier.notifyItem(subscription, subscription.items[0]).then(notified => {
        assert(!notified);
        assert(!chrome.notifications.create.called);
        assert(!sound.play.called);
      });
    });
  });

  it("clicking notification opens page and marks it as read", () => {
    const item = subscription.items[0];
    sinonsb.spy(subscriber, "clearUnreadItem");

    return notifier.notifyItem(subscription, item).then(() => {
      const notifyId = chrome.notifications.create.args[0][0];
      chrome.notifications.onClicked.trigger(notifyId);

      assert(chrome.tabs.create.calledOnce);
      assert.deepEqual(chrome.tabs.create.args[0][0], {
        url: item.url,
        active: true,
      });

      assert(subscriber.clearUnreadItem.calledOnce);
      assert.deepEqual(subscriber.clearUnreadItem.args[0], [
        subscription.id,
        item.id,
      ]);

      // should close the notification
      assert(chrome.notifications.clear.calledOnce);
      assert(chrome.notifications.clear.args[0][0] === notifyId);
    });
  });
});
