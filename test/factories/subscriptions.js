import _ from "lodash";
import factory from "factory-girl";
import Feed from "../../app/scripts/lib/feeds/feed";
import ItemsSubscription from "../../app/scripts/lib/subscriptions/subscription/items";
import StatsSubscription from "../../app/scripts/lib/subscriptions/subscription/stats";

factory.define("feed", Feed, {
  title: factory.seq(n => `Feed title ${n}`),
  url: "http://syosetu.com/messagebox/top/",
  siteName: "Syosetuka ni narou",
  siteId: "narou",
  items: () => _.range(5).map(() => factory.buildSync("feedItem")),
});

factory.define("novelsFeed", Feed, {
  title: factory.seq(n => `Novels Feed title ${n}`),
  url: "http://syosetu.com/usernovel/list/",
  siteName: "Syosetuka ni narou",
  siteId: "narou",
  items: () => _.range(5).map(() => factory.buildSync("novelFeedItem")),
});

factory.define("feedItem", Object, {
  id: factory.seq(n => n.toString()),
  title: factory.seq(n => `Test message ${n}`),
  url: () => `http://syosetu.com/messagebox/view/meskey/${_.random(1, 1000000)}/`,
  type: "message",
  body: factory.seq(n => `Test message body ${n}\nHello, world!`),
  authorName: factory.seq(n => `Sender${n}`),
  authorUrl: () => `http://mypage.syosetu.com/${_.random(1, 1000000)}/`,
  createdAt: () => 1462073640000 + _.random(0, 100000),
});

factory.define("novelFeedItem", Object, {
  id: factory.seq(n => n.toString()),
  title: factory.seq(n => `Test novel ${n}`),
  url: () => `http://ncode.syosetu.com/n${_.random(1, 100000)}ab/`,
  type: "novel",
  body: factory.seq(n => `Test novel description ${n}\nHello, world!`),
  authorName: factory.seq(n => `Author${n}`),
  authorUrl: () => `http://mypage.syosetu.com/${_.random(1, 1000000)}/`,
  createdAt: () => 1462073640000 + _.random(0, 100000),
  updatedAt() { return this.createdAt + _.random(0, 10000); },
  links: () => [
    {
      key: "manage",
      url: `http://syosetu.com/usernovelmanage/top/ncode/${_.random(1, 100000)}/`,
      label: "Manage",
      icon: "cog",
    },
    {
      key: "newEpisode",
      url: `http://syosetu.com/usernovelmanage/ziwainput/ncode/${_.random(1, 100000)}/`,
      label: "New Episode",
      icon: "pencil-square-o",
    },
  ],
  stats: () => [
    {
      key: "point",
      value: _.random(1000, 100000),
      label: "Point",
      icon: "plus",
      unit: "pt",
      link: `http://syosetu.com/usernovelmanage/top/ncode/${_.random(1, 100000)}/`,
    },
    {
      key: "ratePoint",
      order: 2,
      value: _.random(0, 1000),
      label: "Rate Point",
      icon: "star",
      unit: "pt",
    },
    {
      key: "bookmarkCount",
      order: 3,
      value: _.random(0, 100),
      label: "Bookmarks",
      icon: "bookmark",
    },
  ],
});

const itemsSubscriptionSchema = {
  type: "items",
  feedUrl: "novelous-feed://narou/messages",
  feedData: () => factory.buildSync("feed").toObject(),
  enabled: true,
  lastUpdatedAt: null,
  readItemIds() { return _.map(this.feedData.items, "id"); },
};

factory.define("itemsSubscription", ItemsSubscription, itemsSubscriptionSchema);
factory.define("itemsSubscriptionData", Object, itemsSubscriptionSchema);

const statsSubscriptionSchema = {
  type: "stats",
  feedUrl: "novelous-feed://narou/novels",
  feedData: () => factory.buildSync("novelsFeed").toObject(),
  enabled: true,
  lastUpdatedAt: null,
  statsLogs: null,
};

factory.define("statsSubscription", StatsSubscription, statsSubscriptionSchema);
factory.define("statsSubscriptionData", Object, statsSubscriptionSchema);

module.exports = factory;
