import { assert, factory } from "../../../common";
import ItemsSubscription from "../../../../app/scripts/lib/subscriptions/subscription/items";
import helpers from "../helpers";
import baseTestCasesForSubscription from "./base-test-cases";

describe("ItemsSubscription", () => {
  let data;
  let sub;
  const context = {};

  beforeEach(() => {
    context.data = data = factory.buildSync("itemsSubscriptionData");
    context.sub = sub = new ItemsSubscription(data);
  });

  baseTestCasesForSubscription(context);

  it("new ItemsSubscription", () => {
    assert(sub instanceof ItemsSubscription);
  });

  it("has ItemsSubscription properties", () => {
    assert.deepEqual(sub.unreadItems, []);
    assert(sub.unreadItemsCount === 0);
    assert.deepEqual(sub.readItems, sub.items);
    assert(sub.readItemsCount === sub.items.length);
    assert.deepEqual(sub.lastFoundItems, []);
    assert(sub.lastFoundItemsCount === 0);
  });

  describe("#update", () => {
    it("clears all unread items on first time", () => {
      const feed = factory.buildSync("feed");
      helpers.stubFetchFeed(sub, feed);

      sub.feed = null;
      return sub.update().then(() => {
        assert(sub.feed === feed);
        assert.deepEqual(sub.unreadItems, []);
        assert.deepEqual(sub.lastFoundItems, []);
      });
    });

    it("clears all unread items when feed version has changed", () => {
      const [newFeed] = helpers.getFeedWithNewItem(sub.feed);
      newFeed.data.version = 2;
      helpers.stubFetchFeed(sub, newFeed);

      return sub.update().then(() => {
        assert(sub.feed === newFeed);
        assert.deepEqual(sub.unreadItems, []);
        assert.deepEqual(sub.lastFoundItems, []);
      });
    });

    it("does not clear unread items not on first time", async () => {
      const [newFeed, newFeedItem] = helpers.getFeedWithNewItem(sub.feed);
      helpers.stubFetchFeed(sub, newFeed);

      return sub.update().then(() => {
        assert(sub.feed === newFeed);
        assert.deepEqual(sub.unreadItems, [newFeedItem]);
        assert.deepEqual(sub.lastFoundItems, [newFeedItem]);
      });
    });

    it("returns newly found items", async () => {
      const [newFeed, newFeedItem] = helpers.getFeedWithNewItem(sub.feed);
      const stub1 = helpers.stubFetchFeed(sub, newFeed);

      return sub.update().then(() => {
        assert.deepEqual(sub.unreadItems, [newFeedItem]);
        assert.deepEqual(sub.lastFoundItems, [newFeedItem]);

        stub1.restore();

        const [newFeed2, newFeedItem2] = helpers.getFeedWithNewItem(newFeed);
        helpers.stubFetchFeed(sub, newFeed2);

        return sub.update().then(() => {
          assert.deepEqual(sub.unreadItems, [newFeedItem, newFeedItem2]);
          assert.deepEqual(sub.lastFoundItems, [newFeedItem2]);
        });
      });
    });
  });

  describe("#clearUnreadItem", () => {
    it("clears an unread item", () => {
      const [newFeed, newFeedItems] = helpers.getFeedWithNewItems(sub.feed, 3);
      sub.feed = newFeed;

      assert.deepEqual(sub.unreadItems, newFeedItems);
      assert(sub.unreadItemsCount === newFeedItems.length);

      sub.clearUnreadItem(newFeedItems[0]);

      assert.deepEqual(sub.unreadItems, newFeedItems.slice(1));
      assert(sub.unreadItemsCount === newFeedItems.length - 1);
    });
  });

  describe("#clearUnreadItems", () => {
    it("clears all unread items", () => {
      const [newFeed, newFeedItems] = helpers.getFeedWithNewItems(sub.feed, 3);
      sub.feed = newFeed;

      assert.deepEqual(sub.unreadItems, newFeedItems);
      assert(sub.unreadItemsCount === newFeedItems.length);

      sub.clearUnreadItems();

      assert.deepEqual(sub.unreadItems, []);
      assert(sub.unreadItemsCount === 0);
    });
  });
});
