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
    assert(_.isObject(sub.statsLogs));
    assert.deepEqual(_.keys(sub.statsLogs).sort(), _.map(data.feedData.items, "id").sort());
  });

  describe("#update", () => {
    it("records current stats to statsLogs", async () => {
      const item = sub.feed.items[0];
      const [newFeed, newFeedItem] = helpers.getFeedWithNewItem(sub.feed, "novelFeedItem");
      helpers.stubFetchFeed(sub, newFeed);
      sinonsb.stub(_, "now").returns(newFeedItem.updatedAt);

      await sub.update();

      assert(sub.feed === newFeed);
      assert.deepEqual(sub.statsLogs[item.id], {
        timestamps: [_.now()],
        stats: _.mapValues(_.keyBy(item.stats, "key"), stat => [stat.value]),
      });
      assert.deepEqual(sub.statsLogs[newFeedItem.id], {
        timestamps: [_.now()],
        stats: _.mapValues(_.keyBy(newFeedItem.stats, "key"), stat => [stat.value]),
      });
    });

    it("appends current stats to existing statsLogs", async () => {
      const item = sub.feed.items[0];
      const originalLog = _.cloneDeep(sub.statsLogs[item.id]);

      const entries = await helpers.updateSubscriptionWithRandomStats(sub, { num: 2 });

      const { feed: firstFeed, time: firstTime } = entries[0];
      const { feed: secondFeed, time: secondTime } = entries[1];
      const firstStats = _.mapValues(_.keyBy(firstFeed.items[0].stats, "key"), "value");
      const secondStats = _.mapValues(_.keyBy(secondFeed.items[0].stats, "key"), "value");

      assert.deepEqual(sub.statsLogs[item.id], {
        timestamps: originalLog.timestamps.concat([firstTime, secondTime]),
        stats: _.transform(item.stats, (acc, stat) => {
          acc[stat.key] = originalLog.stats[stat.key].concat([
            firstStats[stat.key],
            secondStats[stat.key],
          ]);
        }),
      });
    });

    it("clears existing statsLogs when feed version has changed", async () => {
      const item = sub.feed.items[0];
      const [newFeed, newFeedItem] = helpers.getFeedWithNewItem(sub.feed, "novelFeedItem");
      newFeed.data.version = 2;
      helpers.stubFetchFeed(sub, newFeed);
      sinonsb.stub(_, "now").returns(newFeedItem.updatedAt);

      await sub.update();

      assert(sub.feed === newFeed);
      assert.deepEqual(sub.statsLogs[item.id], {
        timestamps: [_.now()],
        stats: _.mapValues(_.keyBy(item.stats, "key"), stat => [stat.value]),
      });
      assert.deepEqual(sub.statsLogs[newFeedItem.id], {
        timestamps: [_.now()],
        stats: _.mapValues(_.keyBy(newFeedItem.stats, "key"), stat => [stat.value]),
      });
    });

    it("fills past values with 0 for new keys", async () => {
      const item = sub.feed.items[0];
      const originalLog = _.cloneDeep(sub.statsLogs[item.id]);

      await helpers.updateSubscriptionWithRandomStats(sub, {
        customFeed(feed) {
          feed.items[0].stats.push({ key: "testkey", value: 12345 });
        },
      });

      const updatedLog = sub.statsLogs[item.id];
      assert(updatedLog.stats.testkey.length === originalLog.timestamps.length + 1);
      assert(_.every(updatedLog.stats.testkey.slice(0, -1), v => v === 0));
      assert(_.last(updatedLog.stats.testkey) === 12345);
    });

    it("removes expired old values", async () => {
      sub.data.statsLogs = {};
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
        entries[2].feed.items[0].stats[0].value,
        entries[3].feed.items[0].stats[0].value,
        entries[4].feed.items[0].stats[0].value,
      ]);
    });

    it("maintains missing keys by filling with 0", async () => {
      const itemId = sub.feed.items[0].id;
      const originalLog = _.cloneDeep(sub.statsLogs[itemId]);

      await helpers.updateSubscriptionWithRandomStats(sub, {
        customFeed(feed) { feed.items[0].stats.shift(); },
      });

      const updatedLog = sub.statsLogs[itemId];
      assert(updatedLog.timestamps.length === originalLog.timestamps.length + 1);
      assert(updatedLog.stats.point.length === originalLog.stats.point.length + 1);
      assert.deepEqual(updatedLog.stats.point.slice(0, -1), originalLog.stats.point);
      assert(_.last(updatedLog.stats.point) === 0);
    });

    it("removes keys which have completely expired", async () => {
      sub.data.statsLogs = {};
      const entries = await helpers.updateSubscriptionWithRandomStats(sub, { num: 2 });

      // Expired + Missing
      await helpers.updateSubscriptionWithRandomStats(sub, {
        startTime: entries[1].time + StatsSubscription.STATS_LOG_TTL,
        customFeed(feed) { feed.items[0].stats.shift(); },
      });

      const logs = sub.statsLogs[sub.feed.items[0].id];
      assert(!("point" in logs.stats));
    });
  });
});
