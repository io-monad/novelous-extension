import { test, factory } from "../../../common";
import ItemsSubscription from "../../../../app/scripts/lib/subscriptions/subscription/items";
import helpers from "../helpers";
import baseTestCasesForSubscription from "./base-test-cases";

test.beforeEach(t => {
  t.context.data = factory.buildSync("itemsSubscriptionData");
  t.context.sub = new ItemsSubscription(t.context.data);
});

baseTestCasesForSubscription();

test("new ItemsSubscription", t => {
  t.true(t.context.sub instanceof ItemsSubscription);
});

test("has ItemsSubscription properties", t => {
  const { sub } = t.context;
  t.deepEqual(sub.unreadItems, []);
  t.is(sub.unreadItemsCount, 0);
  t.deepEqual(sub.readItems, sub.items);
  t.is(sub.readItemsCount, sub.items.length);
  t.deepEqual(sub.lastFoundItems, []);
  t.is(sub.lastFoundItemsCount, 0);
});

test("#update clears all unread items on first time", t => {
  const { sub } = t.context;
  const feed = factory.buildSync("feed");
  helpers.stubFetchFeed(sub, feed);

  sub.feed = null;
  return sub.update().then(() => {
    t.is(sub.feed, feed);
    t.deepEqual(sub.unreadItems, []);
    t.deepEqual(sub.lastFoundItems, []);
  });
});

test("#update does not clear unread items not on first time", async t => {
  const { sub } = t.context;
  const [newFeed, newFeedItem] = helpers.getFeedWithNewItem(sub.feed);
  helpers.stubFetchFeed(sub, newFeed);

  return sub.update().then(() => {
    t.is(sub.feed, newFeed);
    t.deepEqual(sub.unreadItems, [newFeedItem]);
    t.deepEqual(sub.lastFoundItems, [newFeedItem]);
  });
});

test("#update returns newly found items", async t => {
  const { sub } = t.context;
  const [newFeed, newFeedItem] = helpers.getFeedWithNewItem(sub.feed);
  const stub1 = helpers.stubFetchFeed(sub, newFeed);

  return sub.update().then(() => {
    t.deepEqual(sub.unreadItems, [newFeedItem]);
    t.deepEqual(sub.lastFoundItems, [newFeedItem]);

    stub1.restore();

    const [newFeed2, newFeedItem2] = helpers.getFeedWithNewItem(newFeed);
    helpers.stubFetchFeed(sub, newFeed2);

    return sub.update().then(() => {
      t.deepEqual(sub.unreadItems, [newFeedItem, newFeedItem2]);
      t.deepEqual(sub.lastFoundItems, [newFeedItem2]);
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
