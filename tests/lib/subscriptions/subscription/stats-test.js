import { _, test, factory, sinonsb } from "../../../common";
import StatsSubscription from "../../../../app/scripts/lib/subscriptions/subscription/stats";
import helpers from "../helpers";
import baseTestCasesForSubscription from "./base-test-cases";

test.beforeEach(t => {
  t.context.data = factory.buildSync("statsSubscriptionData");
  t.context.sub = new StatsSubscription(t.context.data);
});

baseTestCasesForSubscription();

test("new StatsSubscription", t => {
  t.true(t.context.sub instanceof StatsSubscription);
});

test("has StatsSubscription properties", t => {
  const { sub } = t.context;
  t.deepEqual(sub.statsLogs, {});
});

test.serial("#update records current stats to statsLogs", async t => {
  const { sub } = t.context;
  const [newFeed, newFeedItem] = helpers.getFeedWithNewItem(sub.feed, "novelFeedItem");
  helpers.stubFetchFeed(sub, newFeed);
  sinonsb.stub(_, "now").returns(newFeedItem.updatedAt);

  await sub.update();

  t.is(sub.feed, newFeed);
  t.true(_.isObject(sub.statsLogs));
  t.true(_.isObject(sub.statsLogs[newFeedItem.id]));

  const logs = sub.statsLogs[newFeedItem.id];
  t.true(_.isArray(logs.timestamps));
  t.deepEqual(logs.timestamps, [_.now()]);

  t.true(_.isObject(logs.stats));
  t.deepEqual(logs.stats, {
    point: [newFeedItem.stats.point],
    bookmarkCount: [newFeedItem.stats.bookmarkCount],
    reviewCount: [newFeedItem.stats.reviewCount],
    ratePoint: [newFeedItem.stats.ratePoint],
  });
});

test.serial("#update appends current stats to existing statsLogs", async t => {
  const { sub } = t.context;
  const entries = await helpers.updateSubscriptionWithRandomStats(sub, { num: 2 });

  const { feed: firstFeed, time: firstTime } = entries[0];
  const { feed: secondFeed, time: secondTime } = entries[1];
  const firstStats = firstFeed.items[0].stats;
  const secondStats = secondFeed.items[0].stats;

  const logs = sub.statsLogs[firstFeed.items[0].id];
  t.deepEqual(logs.timestamps, [firstTime, secondTime]);
  t.deepEqual(logs.stats, {
    point: [firstStats.point, secondStats.point],
    bookmarkCount: [firstStats.bookmarkCount, secondStats.bookmarkCount],
    reviewCount: [firstStats.reviewCount, secondStats.reviewCount],
    ratePoint: [firstStats.ratePoint, secondStats.ratePoint],
  });
});

test.serial("#update fills past values with 0 for new keys", async t => {
  const { sub } = t.context;
  await helpers.updateSubscriptionWithRandomStats(sub, { num: 2 });
  await helpers.updateSubscriptionWithRandomStats(sub, {
    customFeed(feed) { feed.items[0].stats.testkey = 12345; },
  });

  const logs = sub.statsLogs[sub.feed.items[0].id];
  t.deepEqual(logs.stats.testkey, [0, 0, 12345]);
});

test.serial("#update removes expired old values", async t => {
  const { sub } = t.context;
  const entries = await helpers.updateSubscriptionWithRandomStats(sub, { num: 4 });

  // Let first and second logs expire
  const startTime = entries[1].time + StatsSubscription.STATS_LOG_TTL;
  const entries2 = await helpers.updateSubscriptionWithRandomStats(sub, { startTime });
  entries.push(entries2[0]);

  const logs = sub.statsLogs[sub.feed.items[0].id];
  t.deepEqual(logs.timestamps, [
    entries[2].time,
    entries[3].time,
    entries[4].time,
  ]);
  t.deepEqual(logs.stats.point, [
    entries[2].feed.items[0].stats.point,
    entries[3].feed.items[0].stats.point,
    entries[4].feed.items[0].stats.point,
  ]);
});

test.serial("#update maintains missing keys by filling with 0", async t => {
  const { sub } = t.context;
  const entries = await helpers.updateSubscriptionWithRandomStats(sub, { num: 2 });
  await helpers.updateSubscriptionWithRandomStats(sub, {
    customFeed(feed) { delete feed.items[0].stats.point; },
  });

  const logs = sub.statsLogs[sub.feed.items[0].id];
  t.deepEqual(logs.stats.point, [
    entries[0].feed.items[0].stats.point,
    entries[1].feed.items[0].stats.point,
    0,
  ]);
});

test.serial("#update removes keys which have completely expired", async t => {
  const { sub } = t.context;
  const entries = await helpers.updateSubscriptionWithRandomStats(sub, { num: 2 });

  // Expired + Missing
  await helpers.updateSubscriptionWithRandomStats(sub, {
    startTime: entries[1].time + StatsSubscription.STATS_LOG_TTL,
    customFeed(feed) { delete feed.items[0].stats.point; },
  });

  const logs = sub.statsLogs[sub.feed.items[0].id];
  t.false("point" in logs.stats);
});
