import { _, assert, factory, sinonsb } from "../../../common";
import StatsSubscription from "../../../../app/scripts/lib/subscriptions/subscription/stats";
import helpers from "../helpers";
import baseTestCasesForSubscription from "./base-test-cases";

describe("StatsSubscription", () => {
  let data;
  let sub;
  const context = {};

  beforeEach(() => {
    context.data = data = factory.buildSync("statsSubscriptionData");
    context.sub = sub = new StatsSubscription(data);
  });

  baseTestCasesForSubscription(context);

  it("new StatsSubscription", () => {
    assert(sub instanceof StatsSubscription);
  });

  it("has StatsSubscription properties", () => {
    assert.deepEqual(sub.statsLogs, {});
  });

  describe("#update", () => {
    it("records current stats to statsLogs", async () => {
      const [newFeed, newFeedItem] = helpers.getFeedWithNewItem(sub.feed, "novelFeedItem");
      helpers.stubFetchFeed(sub, newFeed);
      sinonsb.stub(_, "now").returns(newFeedItem.updatedAt);

      await sub.update();

      assert(sub.feed === newFeed);
      assert(_.isObject(sub.statsLogs));
      assert(_.isObject(sub.statsLogs[newFeedItem.id]));

      const logs = sub.statsLogs[newFeedItem.id];
      assert(_.isArray(logs.timestamps));
      assert.deepEqual(logs.timestamps, [_.now()]);

      assert(_.isObject(logs.stats));
      assert.deepEqual(logs.stats, {
        point: [newFeedItem.stats.point],
        bookmarkCount: [newFeedItem.stats.bookmarkCount],
        reviewCount: [newFeedItem.stats.reviewCount],
        ratePoint: [newFeedItem.stats.ratePoint],
      });
    });

    it("appends current stats to existing statsLogs", async () => {
      const entries = await helpers.updateSubscriptionWithRandomStats(sub, { num: 2 });

      const { feed: firstFeed, time: firstTime } = entries[0];
      const { feed: secondFeed, time: secondTime } = entries[1];
      const firstStats = firstFeed.items[0].stats;
      const secondStats = secondFeed.items[0].stats;

      const logs = sub.statsLogs[firstFeed.items[0].id];
      assert.deepEqual(logs.timestamps, [firstTime, secondTime]);
      assert.deepEqual(logs.stats, {
        point: [firstStats.point, secondStats.point],
        bookmarkCount: [firstStats.bookmarkCount, secondStats.bookmarkCount],
        reviewCount: [firstStats.reviewCount, secondStats.reviewCount],
        ratePoint: [firstStats.ratePoint, secondStats.ratePoint],
      });
    });

    it("fills past values with 0 for new keys", async () => {
      await helpers.updateSubscriptionWithRandomStats(sub, { num: 2 });
      await helpers.updateSubscriptionWithRandomStats(sub, {
        customFeed(feed) { feed.items[0].stats.testkey = 12345; },
      });

      const logs = sub.statsLogs[sub.feed.items[0].id];
      assert.deepEqual(logs.stats.testkey, [0, 0, 12345]);
    });

    it("removes expired old values", async () => {
      const entries = await helpers.updateSubscriptionWithRandomStats(sub, { num: 4 });

      // Let first and second logs expire
      const startTime = entries[1].time + StatsSubscription.STATS_LOG_TTL;
      const entries2 = await helpers.updateSubscriptionWithRandomStats(sub, { startTime });
      entries.push(entries2[0]);

      const logs = sub.statsLogs[sub.feed.items[0].id];
      assert.deepEqual(logs.timestamps, [
        entries[2].time,
        entries[3].time,
        entries[4].time,
      ]);
      assert.deepEqual(logs.stats.point, [
        entries[2].feed.items[0].stats.point,
        entries[3].feed.items[0].stats.point,
        entries[4].feed.items[0].stats.point,
      ]);
    });

    it("maintains missing keys by filling with 0", async () => {
      const entries = await helpers.updateSubscriptionWithRandomStats(sub, { num: 2 });
      await helpers.updateSubscriptionWithRandomStats(sub, {
        customFeed(feed) { delete feed.items[0].stats.point; },
      });

      const logs = sub.statsLogs[sub.feed.items[0].id];
      assert.deepEqual(logs.stats.point, [
        entries[0].feed.items[0].stats.point,
        entries[1].feed.items[0].stats.point,
        0,
      ]);
    });

    it("removes keys which have completely expired", async () => {
      const entries = await helpers.updateSubscriptionWithRandomStats(sub, { num: 2 });

      // Expired + Missing
      await helpers.updateSubscriptionWithRandomStats(sub, {
        startTime: entries[1].time + StatsSubscription.STATS_LOG_TTL,
        customFeed(feed) { delete feed.items[0].stats.point; },
      });

      const logs = sub.statsLogs[sub.feed.items[0].id];
      assert(!("point" in logs.stats));
    });
  });
});
