import { _, test, sinon, sinonsb, factory } from "../../common";
import SubscriberNotifier from "../../../app/scripts/lib/background/subscriber-notifier";
import Subscriber from "../../../app/scripts/lib/subscriptions/subscriber";
import AppVars from "../../../app/scripts/lib/app/app-vars";

const realAudio = global.Audio;
test.beforeEach(t => {
  t.context.sound = { play: sinon.spy() };
  global.Audio = sinon.stub().returns(t.context.sound);

  t.context.subscriber = new Subscriber([
    factory.buildSync("itemsSubscriptionData"),
  ]);
  t.context.subscription = t.context.subscriber.subscriptions[0];
  t.context.notifier = new SubscriberNotifier(t.context.subscriber);

  chrome.notifications.create.callsArgAsync(2);
});
test.afterEach(() => {
  if (realAudio) {
    global.Audio = realAudio;
  } else {
    delete global.Audio;
  }
});

test.serial("subscriber update makes notifiactions", t => {
  const { subscriber, subscription, notifier } = t.context;
  const notifyItemStub = sinonsb.stub(notifier, "notifyItem");
  subscription._lastFoundItems = subscription.items.slice(0, 2);
  subscriber.emit("update");
  t.true(notifyItemStub.calledTwice);
  t.is(notifyItemStub.args[0][0], subscription);
  t.is(notifyItemStub.args[0][1], subscription.items[0]);
  t.is(notifyItemStub.args[1][0], subscription);
  t.is(notifyItemStub.args[1][1], subscription.items[1]);
});

test.serial("#notifyItem creates notification", t => {
  const { sound, subscription, notifier } = t.context;
  const item = subscription.items[0];

  return notifier.notifyItem(subscription, item).then(notified => {
    t.true(notified);
    t.true(chrome.notifications.create.calledOnce);
    const [notifyId, options] = chrome.notifications.create.args[0];

    t.true(_.isString(notifyId));
    t.deepEqual(options, {
      type: "basic",
      iconUrl: AppVars.iconUrl[128],
      title: `${subscription.siteName}: ${subscription.title}`,
      message: `${item.title}\n${item.authorName}`,
      contextMessage: item.body,
      isClickable: true,
    });

    t.true(sound.play.calledOnce);
  });
});

test.serial("#notifyItem ignores notified item", t => {
  const { subscription, notifier } = t.context;
  const item = subscription.items[0];

  return notifier.notifyItem(subscription, item).then(notified => {
    t.true(notified);
    t.true(chrome.notifications.create.calledOnce);

    return notifier.notifyItem(subscription, item).then(notified2 => {
      t.false(notified2);
      t.true(chrome.notifications.create.calledOnce);
    });
  });
});

test.serial("#notifyItem ignores disabled subscription", t => {
  const { subscription, notifier } = t.context;
  const item = subscription.items[0];
  notifier.options.enabledSubscriptionIds[subscription.id] = false;

  return notifier.notifyItem(subscription, item).then(notified => {
    t.false(notified);
    t.false(chrome.notifications.create.calledOnce);
  });
});

test.serial("#notifyItem respects alertEnabled setting", t => {
  const { sound, subscription, notifier } = t.context;

  notifier.options.alertEnabled = false;
  return notifier.notifyItem(subscription, subscription.items[0]).then(notified => {
    t.true(notified);
    t.false(chrome.notifications.create.called);
    t.true(sound.play.calledOnce);
  });
});

test.serial("#notifyItem respects soundEnabled setting", t => {
  const { sound, subscription, notifier } = t.context;

  notifier.options.soundEnabled = false;
  return notifier.notifyItem(subscription, subscription.items[0]).then(notified => {
    t.true(notified);
    t.true(chrome.notifications.create.called);
    t.false(sound.play.called);
  });
});

test.serial("#notifyItem skips notification if both disabled", t => {
  const { sound, subscription, notifier } = t.context;

  notifier.options.alertEnabled = false;
  notifier.options.soundEnabled = false;
  return notifier.notifyItem(subscription, subscription.items[0]).then(notified => {
    t.false(notified);
    t.false(chrome.notifications.create.called);
    t.false(sound.play.called);
  });
});

test.serial("clicking notification opens page and marks it as read", t => {
  const { subscriber, subscription, notifier } = t.context;
  const item = subscription.items[0];
  sinonsb.spy(subscriber, "clearUnreadItem");

  return notifier.notifyItem(subscription, item).then(() => {
    const notifyId = chrome.notifications.create.args[0][0];
    chrome.notifications.onClicked.trigger(notifyId);

    t.true(chrome.tabs.create.calledOnce);
    t.deepEqual(chrome.tabs.create.args[0][0], {
      url: item.url,
      active: true,
    });

    t.true(subscriber.clearUnreadItem.calledOnce);
    t.deepEqual(subscriber.clearUnreadItem.args[0], [
      subscription.id,
      item.id,
    ]);

    // should close the notification
    t.true(chrome.notifications.clear.calledOnce);
    t.is(chrome.notifications.clear.args[0][0], notifyId);
  });
});
