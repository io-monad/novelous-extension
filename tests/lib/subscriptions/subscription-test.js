import { _, test, factory, sinonsb } from "../../common";
import Subscription from "../../../app/scripts/lib/subscriptions/subscription";
import Feed from "../../../app/scripts/lib/feeds/feed";

test.beforeEach(t => {
  t.context.settings = factory.buildSync("subscriptionSettings");
  t.context.sub = new Subscription(t.context.settings);
});

test("new Subscription", t => {
  t.truthy(t.context.sub instanceof Subscription);
});

test("has properties", t => {
  const { sub, settings } = t.context;
  t.is(sub.id, settings.feedUrl);
  t.is(sub.feedUrl, settings.feedUrl);
  t.is(sub.enabled, settings.enabled);
  t.is(sub.lastUpdatedAt, settings.lastUpdatedAt);
  t.truthy(sub.feed instanceof Feed);
  t.deepEqual(sub.unreadItems, []);
  t.is(sub.unreadItemsCount, 0);
});

test.serial("#update updates holding feed", t => {
  const { sub } = t.context;
  const feed = factory.buildSync("feed");
  const stub = sinonsb.stub(sub._feedFetcher, "fetchFeed").returns(Promise.resolve(feed));
  sinonsb.stub(_, "now").returns(1234567890);

  return sub.update().then(foundItems => {
    t.true(stub.calledOnce);
    t.is(sub.feed, feed);
    t.is(sub.lastUpdatedAt, _.now());
    t.deepEqual(foundItems, feed.items);
  });
});

test("#update clears all unread items on first time", t => {
  const { sub } = t.context;
  const feed = factory.buildSync("feed");
  sinonsb.stub(sub._feedFetcher, "fetchFeed").returns(Promise.resolve(feed));

  sub.feed = null;
  return sub.update().then(foundItems => {
    t.is(sub.feed, feed);
    t.deepEqual(sub.unreadItems, []);
    t.deepEqual(foundItems, []);
  });
});

test("#update does not clear unread items not on first time", async t => {
  const { sub } = t.context;

  const newFeedItem = factory.buildSync("feedItem");
  const newFeed = new Feed(_.cloneDeep(sub.feed.toObject()));
  newFeed.items.push(newFeedItem);

  sinonsb.stub(sub._feedFetcher, "fetchFeed").returns(Promise.resolve(newFeed));
  return sub.update().then(foundItems => {
    t.is(sub.feed, newFeed);
    t.deepEqual(sub.unreadItems, [newFeedItem]);
    t.deepEqual(foundItems, [newFeedItem]);
  });
});

test("#update returns newly found items", async t => {
  const { sub } = t.context;

  const newFeedItem = factory.buildSync("feedItem");
  const newFeed = new Feed(_.cloneDeep(sub.feed.toObject()));
  newFeed.items.push(newFeedItem);

  const stub1 = sinonsb.stub(sub._feedFetcher, "fetchFeed").returns(Promise.resolve(newFeed));
  return sub.update().then(foundItems => {
    t.deepEqual(foundItems, [newFeedItem]);
    t.deepEqual(sub.unreadItems, [newFeedItem]);

    stub1.restore();
    const newFeedItem2 = factory.buildSync("feedItem");
    const newFeed2 = new Feed(_.cloneDeep(newFeed.toObject()));
    newFeed2.items.push(newFeedItem2);
    sinonsb.stub(sub._feedFetcher, "fetchFeed").returns(Promise.resolve(newFeed2));
    return sub.update().then(foundItems2 => {
      t.deepEqual(foundItems2, [newFeedItem2]);
      t.deepEqual(sub.unreadItems, [newFeedItem, newFeedItem2]);
    });
  });
});

test("#clearUnreadItems clears unread items", t => {
  const { sub } = t.context;
  t.deepEqual(sub.unreadItems, []);
  t.is(sub.unreadItemsCount, 0);

  const newFeedItem = factory.buildSync("feedItem");
  const newFeed = new Feed(_.cloneDeep(sub.feed.toObject()));
  newFeed.items.push(newFeedItem);
  sub.feed = newFeed;
  t.deepEqual(sub.unreadItems, [newFeedItem]);
  t.is(sub.unreadItemsCount, 1);

  sub.clearUnreadItems();
  t.deepEqual(sub.unreadItems, []);
  t.is(sub.unreadItemsCount, 0);
});
