import factory from "factory-girl";
import Subscription from "../../app/scripts/lib/subscriptions/subscription";

const subscriptionSchema = {
  siteName: "narou",
  itemType: "novel",
  itemId: factory.seq(n => `n${n}`),
  item: () => factory.buildSync("narouNovel"),
  lastUpdatedAt: null,
};

const kakuyomuSubscriptionSchema = {
  siteName: "kakuyomu",
  itemType: "novel",
  itemId: factory.seq(n => `${n}`),
  item: () => factory.buildSync("kakuyomuNovel"),
  lastUpdatedAt: null,
};

factory.define("subscription", Subscription, subscriptionSchema);
factory.define("subscriptionSettings", Object, subscriptionSchema);
factory.define("kakuyomuSubscription", Subscription, kakuyomuSubscriptionSchema);
factory.define("kakuyomuSubscriptionSettings", Object, kakuyomuSubscriptionSchema);

module.exports = factory;
