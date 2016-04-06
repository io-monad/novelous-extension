import { test, factory, sinonsb } from "../../common";
import Subscription from "../../../app/scripts/lib/subscriptions/subscription";
import Feed from "../../../app/scripts/lib/feeds/feed";

test.beforeEach(t => {
  t.context.settings = factory.buildSync("subscriptionSettings");
  t.context.sub = new Subscription(t.context.settings);
});

test("new Subscription", t => {
  t.ok(t.context.sub instanceof Subscription);
});

test("has properties", t => {
  const { sub, settings } = t.context;
  t.is(sub.id, settings.feedUrl);
  t.is(sub.feedUrl, settings.feedUrl);
  t.is(sub.enabled, settings.enabled);
  t.is(sub.lastUpdatedAt, settings.lastUpdatedAt);
  t.ok(sub.feed instanceof Feed);
  t.same(sub.newItems, []);
  t.is(sub.newItemsCount, 0);
});

test.serial("#update updates holding feed", t => {
  const { sub } = t.context;
  const feed = factory.buildSync("feed");
  const stub = sinonsb.stub(sub._feedFetcher, "fetchFeed").returns(Promise.resolve(feed));
  sinonsb.stub(_, "now").returns(1234567890);

  return sub.update().then(() => {
    t.true(stub.calledOnce);
    t.is(sub.feed, feed);
    t.is(sub.lastUpdatedAt, _.now());
  });
});

test("#update clears all new items on first time", t => {
  const { sub } = t.context;
  const feed = factory.buildSync("feed");
  sinonsb.stub(sub._feedFetcher, "fetchFeed").returns(Promise.resolve(feed));

  sub.feed = null;
  return sub.update().then(() => {
    t.is(sub.feed, feed);
    t.same(sub.newItems, []);
  });
});

test("#update does not clear new items not on first time", async t => {
  const { sub } = t.context;

  const newFeedItem = factory.buildSync("feedItem");
  const newFeed = new Feed(_.cloneDeep(sub.feed.toObject()));
  newFeed.items.push(newFeedItem);

  sinonsb.stub(sub._feedFetcher, "fetchFeed").returns(Promise.resolve(newFeed));
  return sub.update().then(() => {
    t.is(sub.feed, newFeed);
    t.same(sub.newItems, [newFeedItem]);
  });
});

test("#clearNewItems clears new items", t => {
  const { sub } = t.context;
  t.same(sub.newItems, []);
  t.is(sub.newItemsCount, 0);

  const newFeedItem = factory.buildSync("feedItem");
  const newFeed = new Feed(_.cloneDeep(sub.feed.toObject()));
  newFeed.items.push(newFeedItem);
  sub.feed = newFeed;
  t.same(sub.newItems, [newFeedItem]);
  t.is(sub.newItemsCount, 1);

  sub.clearNewItems();
  t.same(sub.newItems, []);
  t.is(sub.newItemsCount, 0);
});
