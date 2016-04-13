import _ from "lodash";
import factory from "factory-girl";
import Feed from "../../app/scripts/lib/feeds/feed";
import ItemsSubscription from "../../app/scripts/lib/subscriptions/subscription/items";

factory.define("feed", Feed, {
  title: factory.seq(n => `Feed title ${n}`),
  url: "http://syosetu.com/messagebox/top/",
  siteName: "Syosetuka ni narou",
  siteId: "narou",
  items: () => _.range(5).map(() => factory.buildSync("feedItem")),
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

module.exports = factory;
