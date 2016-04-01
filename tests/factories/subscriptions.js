import factory from "factory-girl";
import Subscription from "../../app/scripts/lib/subscriptions/subscription";
import Subscriber from "../../app/scripts/lib/subscriptions/subscriber";

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

const subscriberSchema = {
  sites: {
    narou: true,
    kakuyomu: true,
  },
};

factory.define("subscription", Subscription, subscriptionSchema);
factory.define("subscriptionSettings", Object, subscriptionSchema);
factory.define("kakuyomuSubscription", Subscription, kakuyomuSubscriptionSchema);
factory.define("kakuyomuSubscriptionSettings", Object, kakuyomuSubscriptionSchema);
factory.define("subscriber", Subscriber, subscriberSchema);
factory.define("subscriberSettings", Object, subscriberSchema);

module.exports = factory;
