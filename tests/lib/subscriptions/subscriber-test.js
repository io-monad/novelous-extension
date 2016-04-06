import { test, factory, sinon } from "../../common";
import Subscriber from "../../../app/scripts/lib/subscriptions/subscriber";
import Feed from "../../../app/scripts/lib/feeds/feed";

test.beforeEach(t => {
  t.context.settings = _.range(3).map(() => factory.buildSync("subscriptionSettings"));
  t.context.subscriber = new Subscriber(t.context.settings, { fetchInterval: 0 });
});

test("new Subscriber", t => {
  t.ok(t.context.subscriber instanceof Subscriber);
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

  t.is(subscriber.subscriptions.length, 5);
  t.true(
    _.every(
      _.zip(newSettings, subscriber.subscriptions),
      ([setting, subscription]) => _.isEqual(setting, subscription.toObject()),
    )
  );
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

test.cb("#clearNewItems", t => {
  const { subscriber } = t.context;

  const clearStub = sinon.stub();
  _.each(subscriber.subscriptions, sub => { sub.clearNewItems = clearStub; });

  subscriber.on("update", () => {
    t.is(clearStub.callCount, subscriber.subscriptions.length);
    t.end();
  });
  subscriber.clearNewItems();
});

test("#getNewItemsCount", async t => {
  const { subscriber } = t.context;
  t.is(subscriber.getNewItemsCount(), 0);

  addNewItems(subscriber.subscriptions[0], 2);
  addNewItems(subscriber.subscriptions[1], 1);

  t.is(subscriber.getNewItemsCount(), 3);
});

function addNewItems(subscription, num) {
  const newItems = _.range(num).map(() => factory.buildSync("feedItem"));
  const feedData = _.cloneDeep(subscription.feed.toObject());
  feedData.items = feedData.items.concat(newItems);
  subscription.feed = new Feed(feedData);
}
