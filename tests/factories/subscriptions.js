import factory from "factory-girl";
import Subscription from "../../app/scripts/lib/subscriptions/subscription";

const subscriptionSchema = {
  feedName: "narou-messages",
  feedData() {
    const items = _.range(5).map(() => factory.buildSync("narouMessage"));
    return {
      items,
      watch: _.transform(items, (ids, item) => { ids[item.id] = 1; }, {}),
    };
  },
  enabled: true,
  lastUpdatedAt: null,
};

const kakuyomuSubscriptionSchema = {
  feedName: "kakuyomu-reviews",
  feedData() {
    const items = _.range(5).map(() => factory.buildSync("kakuyomuReviewFeedItem"));
    return {
      items,
      watch: _.transform(items, (ids, item) => { ids[item.id] = 1; }, {}),
    };
  },
  enabled: true,
  lastUpdatedAt: null,
};

factory.define("subscription", Subscription, subscriptionSchema);
factory.define("subscriptionSettings", Object, subscriptionSchema);
factory.define("kakuyomuSubscription", Subscription, kakuyomuSubscriptionSchema);
factory.define("kakuyomuSubscriptionSettings", Object, kakuyomuSubscriptionSchema);

module.exports = factory;
