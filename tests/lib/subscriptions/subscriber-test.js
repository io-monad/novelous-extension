import { _, test, factory, sinon, sinonsb } from "../../common";
import Subscriber from "../../../app/scripts/lib/subscriptions/subscriber";
import Feed from "../../../app/scripts/lib/feeds/feed";

test.beforeEach(t => {
  t.context.settings = _.range(3).map(() => factory.buildSync("subscriptionSettings"));
  t.context.subscriber = new Subscriber(t.context.settings, { fetchInterval: 0 });
});

test("new Subscriber", t => {
  t.truthy(t.context.subscriber instanceof Subscriber);
});

test("#subscriptionSettings getter", t => {
  const { subscriber, settings } = t.context;
  const gotSettings = subscriber.subscriptionSettings;
  t.true(_.isArray(gotSettings));
  t.is(gotSettings.length, settings.length);
  t.true(_.every(gotSettings, _.isObject));
});

test("#subscriptionSettings setter", t => {
  const { subscriber } = t.context;
  const newSettings = _.range(5).map(() => factory.buildSync("subscriptionSettings"));
  subscriber.subscriptionSettings = newSettings;

  t.is(subscriber.subscriptions.length, newSettings.length);
  _.each(subscriber.subscriptions, (subscription, i) => {
    t.deepEqual(subscription.toObject(), newSettings[i]);
  });
});

test.cb("#subscribe", t => {
  const { subscriber, settings } = t.context;
  const subscription = factory.buildSync("subscription");
  subscriber.on("update", t.end);
  subscriber.subscribe(subscription);
  t.is(subscriber.subscriptions.length, settings.length + 1);
  t.is(subscriber.subscriptions[settings.length], subscription);
});

test.cb("#unsubscribe", t => {
  const { subscriber, settings } = t.context;
  const subscription = factory.buildSync("subscription");
  subscriber.subscribe(subscription);
  subscriber.on("update", t.end);
  subscriber.unsubscribe(subscription);
  t.is(subscriber.subscriptions.length, settings.length);
});

test("#updateAll", t => {
  const { subscriber } = t.context;
  const updateStub = sinon.stub().returns(Promise.resolve(true));
  _.each(subscriber.subscriptions, sub => { sub.update = updateStub; });

  let emitted = false;
  subscriber.on("update", () => { emitted = true; });

  return subscriber.updateAll().then(() => {
    t.is(updateStub.callCount, subscriber.subscriptions.length);
    t.true(emitted);
  });
});

test("#updateAll skips login required subscriptions when not logged in", t => {
  const { subscriber } = t.context;

  const notLoggedIn = new Error("Not logged in");
  notLoggedIn.name = "LoginRequiredError";

  const updateStub = sinon.stub();
  updateStub.returns(Promise.reject(notLoggedIn));
  _.each(subscriber.subscriptions, sub => { sub.update = updateStub; });

  return subscriber.updateAll().then(() => {
    t.is(updateStub.callCount, 1);
  }).catch(e => {
    t.fail(e);
  });
});

test.serial("#updateAll continues iteration when error occurred", t => {
  const { subscriber } = t.context;

  const error = new Error("Test Error");
  const updateStub = sinon.stub();
  updateStub.returns(Promise.reject(error));
  _.each(subscriber.subscriptions, sub => { sub.update = updateStub; });

  sinonsb.stub(console, "error");
  return subscriber.updateAll().then(() => {
    t.is(updateStub.callCount, 3);
  }).catch(e => {
    t.fail(e);
  });
});

test.cb("#clearUnreadItems", t => {
  const { subscriber } = t.context;

  const clearStub = sinon.stub();
  _.each(subscriber.subscriptions, sub => { sub.clearUnreadItems = clearStub; });

  subscriber.on("update", () => {
    t.is(clearStub.callCount, subscriber.subscriptions.length);
    t.end();
  });
  subscriber.clearUnreadItems();
});

test("#getUnreadItemsCount", async t => {
  const { subscriber } = t.context;
  t.is(subscriber.getUnreadItemsCount(), 0);

  addUnreadItems(subscriber.subscriptions[0], 2);
  addUnreadItems(subscriber.subscriptions[1], 1);

  t.is(subscriber.getUnreadItemsCount(), 3);
});

function addUnreadItems(subscription, num) {
  const unreadItems = _.range(num).map(() => factory.buildSync("feedItem"));
  const feedData = _.cloneDeep(subscription.feed.toObject());
  feedData.items = feedData.items.concat(unreadItems);
  subscription.feed = new Feed(feedData);
}
