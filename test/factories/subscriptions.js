import _ from "lodash";
import factory from "../test-utils/factory";
import Feed from "../../app/scripts/lib/feeds/feed";
import ItemsSubscription from "../../app/scripts/lib/subscriptions/subscription/items";
import StatsSubscription from "../../app/scripts/lib/subscriptions/subscription/stats";

factory.define("feed", Feed, {
  title: factory.seqstr("Feed title #"),
  url: "http://syosetu.com/messagebox/top/",
  siteName: "Syosetuka ni narou",
  siteId: "narou",
  items: factory.builder(5, "feedItem"),
});

factory.define("novelsFeed", Feed, {
  title: factory.seqstr("Novels Feed title #"),
  url: "http://syosetu.com/usernovel/list/",
  siteName: "Syosetuka ni narou",
  siteId: "narou",
  items: factory.builder(5, "novelFeedItem"),
});

factory.define("feedItem", Object, {
  id: factory.seq(n => n.toString()),
  title: factory.seqstr("Test message #"),
  url() { return `http://syosetu.com/messagebox/view/meskey/${this.id}/`; },
  type: "message",
  body: factory.seqstr("Test message body #\nHello, world!"),
  authorName: factory.seqstr("Sender#"),
  authorUrl: factory.numstr("http://mypage.syosetu.com/#/"),
  createdAt: factory.timestamp(),
});

factory.define("novelFeedItem", Object, {
  id: factory.seqstr("n#ab"),
  title: factory.seqstr("Test novel #"),
  url() { return `http://ncode.syosetu.com/${this.id}/`; },
  type: "novel",
  body: factory.seqstr("Test novel description #\nHello, world!"),
  authorName: factory.seqstr("Author#"),
  authorUrl: factory.numstr("http://mypage.syosetu.com/#/"),
  createdAt: factory.timestamp(),
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
  lastUpdatedAt: factory.timestamp(),
  readItemIds() { return _.map(this.feedData.items, "id"); },
};

factory.define("itemsSubscription", ItemsSubscription, itemsSubscriptionSchema);
factory.define("itemsSubscriptionData", Object, itemsSubscriptionSchema);

const statsSubscriptionSchema = {
  type: "stats",
  feedUrl: "novelous-feed://narou/novels",
  feedData: () => factory.buildSync("novelsFeed").toObject(),
  enabled: true,
  lastUpdatedAt: factory.timestamp(),
  statsLogs() {
    const buildTimestamps = factory.timestamps(5);
    const buildStatValues = factory.numbers(5);
    return _.zipObject(
      _.map(this.feedData.items, "id"),
      _.map(this.feedData.items, item => ({
        timestamps: buildTimestamps(),
        stats: _.zipObject(
          _.map(item.stats, "key"),
          _.map(item.stats, buildStatValues)
        ),
      }))
    );
  },
};

factory.define("statsSubscription", StatsSubscription, statsSubscriptionSchema);
factory.define("statsSubscriptionData", Object, statsSubscriptionSchema);
