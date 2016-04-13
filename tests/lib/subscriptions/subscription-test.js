import { _, test, factory, sinonsb } from "../../common";
import Subscription from "../../../app/scripts/lib/subscriptions/subscription";
import Feed from "../../../app/scripts/lib/feeds/feed";
import helpers from "./helpers";

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

  t.true(sub.feed instanceof Feed);
  t.is(sub.title, settings.feedData.title);
  t.is(sub.url, settings.feedData.url);
  t.is(sub.siteName, settings.feedData.siteName);
  t.is(sub.siteId, settings.feedData.siteId);
  t.deepEqual(sub.items, settings.feedData.items);

  t.deepEqual(sub.unreadItems, []);
  t.is(sub.unreadItemsCount, 0);
  t.deepEqual(sub.readItems, sub.items);
  t.is(sub.readItemsCount, sub.items.length);
  t.deepEqual(sub.lastFoundItems, []);
  t.is(sub.lastFoundItemsCount, 0);
});

test.serial("#update updates holding feed", t => {
  const { sub } = t.context;
  const feed = factory.buildSync("feed");
  const stub = helpers.stubFetchFeed(sub, feed);
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
  helpers.stubFetchFeed(sub, feed);

  sub.feed = null;
  return sub.update().then(foundItems => {
    t.is(sub.feed, feed);
    t.deepEqual(sub.unreadItems, []);
    t.deepEqual(foundItems, []);
  });
});

test("#update does not clear unread items not on first time", async t => {
  const { sub } = t.context;
  const [newFeed, newFeedItem] = helpers.getFeedWithNewItem(sub.feed);
  helpers.stubFetchFeed(sub, newFeed);

  return sub.update().then(foundItems => {
    t.is(sub.feed, newFeed);
    t.deepEqual(sub.unreadItems, [newFeedItem]);
    t.deepEqual(foundItems, [newFeedItem]);
  });
});

test("#update returns newly found items", async t => {
  const { sub } = t.context;
  const [newFeed, newFeedItem] = helpers.getFeedWithNewItem(sub.feed);
  const stub1 = helpers.stubFetchFeed(sub, newFeed);

  return sub.update().then(foundItems => {
    t.deepEqual(foundItems, [newFeedItem]);
    t.deepEqual(sub.unreadItems, [newFeedItem]);

    stub1.restore();

    const [newFeed2, newFeedItem2] = helpers.getFeedWithNewItem(newFeed);
    helpers.stubFetchFeed(sub, newFeed2);

    return sub.update().then(foundItems2 => {
      t.deepEqual(foundItems2, [newFeedItem2]);
      t.deepEqual(sub.unreadItems, [newFeedItem, newFeedItem2]);
    });
  });
});

test("#clearUnreadItem clears an unread item", t => {
  const { sub } = t.context;
  const [newFeed, newFeedItems] = helpers.getFeedWithNewItems(sub.feed, 3);
  sub.feed = newFeed;

  t.deepEqual(sub.unreadItems, newFeedItems);
  t.is(sub.unreadItemsCount, newFeedItems.length);

  sub.clearUnreadItem(newFeedItems[0]);

  t.deepEqual(sub.unreadItems, newFeedItems.slice(1));
  t.is(sub.unreadItemsCount, newFeedItems.length - 1);
});

test("#clearUnreadItems clears all unread items", t => {
  const { sub } = t.context;
  const [newFeed, newFeedItems] = helpers.getFeedWithNewItems(sub.feed, 3);
  sub.feed = newFeed;

  t.deepEqual(sub.unreadItems, newFeedItems);
  t.is(sub.unreadItemsCount, newFeedItems.length);

  sub.clearUnreadItems();

  t.deepEqual(sub.unreadItems, []);
  t.is(sub.unreadItemsCount, 0);
});
