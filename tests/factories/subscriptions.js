import _ from "lodash";
import factory from "factory-girl";
import Feed from "../../app/scripts/lib/feeds/feed";
import Subscription from "../../app/scripts/lib/subscriptions/subscription";

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

const subscriptionSchema = {
  feedUrl: "novelous-feed://narou/messages",
  feedData: () => factory.buildSync("feed").toObject(),
  readItemIds() { return _.map(this.feedData.items, "id"); },
  enabled: true,
  lastUpdatedAt: null,
};

factory.define("subscription", Subscription, subscriptionSchema);
factory.define("subscriptionSettings", Object, subscriptionSchema);

module.exports = factory;
