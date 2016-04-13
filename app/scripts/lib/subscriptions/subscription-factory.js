import ItemsSubscription from "./subscription/items";

/**
 * Enum for subscription type.
 *
 * @enum {Class}
 */
const SubscriptionType = {
  items: ItemsSubscription,
};

/**
 * Factory for Subscription.
 *
 * @name SubscriptionFactory
 */
export default {
  /**
   * Create Subscription depends on subscription type.
   *
   * @param {SubscriptionData} data - Subscription data.
   *     Valid `type` must be specified for creation.
   */
  create(data) {
    if (!data || !data.type) {
      throw new Error("No subscription type specified");
    }

    const SubscriptionClass = SubscriptionType[data.type];
    if (!SubscriptionClass) {
      throw new Error(`Unknown subscription type: ${data.type}`);
    }

    return new SubscriptionClass(data);
  },
};
