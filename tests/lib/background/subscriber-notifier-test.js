import { _, test, sinonsb, factory } from "../../common";
import SubscriberNotifier from "../../../app/scripts/lib/background/subscriber-notifier";
import Subscriber from "../../../app/scripts/lib/subscriptions/subscriber";
import AppVars from "../../../app/scripts/lib/app/app-vars";

test.beforeEach(t => {
  t.context.subscriber = new Subscriber([
    factory.buildSync("subscriptionSettings"),
  ]);
  t.context.subscription = t.context.subscriber.subscriptions[0];
  t.context.notifier = new SubscriberNotifier(t.context.subscriber);
});

test("subscriber update makes notifiactions", t => {
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
  const { subscription, notifier } = t.context;
  const item = subscription.items[0];
  chrome.notifications.create.callsArgAsync(2);

  return notifier.notifyItem(subscription, item).then(notified => {
    t.true(notified);
    t.true(chrome.notifications.create.calledOnce);
    const [notifyId, options] = chrome.notifications.create.args[0];

    t.true(_.isString(notifyId));
    t.deepEqual(options, {
      type: "basic",
      iconUrl: AppVars.iconUrl[128],
      title: subscription.title,
      message: item.title,
      contextMessage: item.body,
      isClickable: true,
    });
  });
});

test.serial("#notifyItem ignores notified item", t => {
  const { subscription, notifier } = t.context;
  const item = subscription.items[0];
  chrome.notifications.create.callsArgAsync(2);

  return notifier.notifyItem(subscription, item).then(notified => {
    t.true(notified);
    t.true(chrome.notifications.create.calledOnce);

    return notifier.notifyItem(subscription, item).then(notified2 => {
      t.false(notified2);
      t.true(chrome.notifications.create.calledOnce);
    });
  });
});

test.serial("clicking notification opens page and marks it as read", t => {
  const { subscriber, subscription, notifier } = t.context;
  const item = subscription.items[0];
  chrome.notifications.create.callsArgAsync(2);
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
