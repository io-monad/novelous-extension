import url from "url";
import EventEmitter from "events";
import _ from "lodash";
import promises from "../util/promises";
import SubscriptionFactory from "./subscription-factory";
const logger = debug("subscriber");

/**
 * Subscriber holds subscription list and update them from remote sites.
 */
export default class Subscriber extends EventEmitter {
  /**
   * @param {SubscriptionData[]} subscriptionSettings
   */
  constructor(subscriptionSettings) {
    super();
    this.subscriptionSettings = subscriptionSettings;
  }

  /**
   * @return {SubscriptionData[]}
   */
  get subscriptionSettings() {
    return _.invokeMap(this.subscriptions, "toObject");
  }

  /**
   * @param {SubscriptionData[]} subscriptionSettings
   */
  set subscriptionSettings(subscriptionSettings) {
    this._subscriptions = _.map(subscriptionSettings || [], data => {
      return SubscriptionFactory.create(data);
    });
    this._typeToSubscriptions = _.groupBy(this._subscriptions, sub => sub.type);
  }

  /**
   * @return {Subscription[]}
   */
  get subscriptions() {
    return this._subscriptions;
  }

  /**
   * @param {Subscription[]} subscriptions
   */
  set subscriptions(subscriptions) {
    if (subscriptions === this._subscriptions) return;
    this._subscriptions = _.clone(subscriptions || []);
    this.emit("update");
  }

  /**
   * @param {string} type
   * @return {Subscription[]}
   */
  getSubscriptionsForType(type) {
    return this._typeToSubscriptions[type] || [];
  }

  /**
   * @return {ItemsSubscription[]}
   */
  get itemsSubscriptions() {
    return this.getSubscriptionsForType("items");
  }

  /**
   * @return {StatsSubscription[]}
   */
  get statsSubscriptions() {
    return this.getSubscriptionsForType("stats");
  }

  /**
   * Update all subscriptions.
   *
   * @return {Promise.<Subscriber>}
   */
  updateAll() {
    logger("Updating all subscriptions");
    const subscriptions = _.filter(this.subscriptions, "enabled");
    const hostToSubscriptions = _.groupBy(subscriptions, sub => {
      return url.parse(sub.feedUrl).host || "other";
    });

    const updatePromises = _.map(
      hostToSubscriptions,
      (subs, host) => this._updateSequence(host, subs)
    );
    return Promise.all(updatePromises).then(() => {
      logger("Updated all subscriptions");
      this.emit("update");
      return this;
    }).catch(e => {
      console.error("Error in subscriber.updateAll:", e);
      throw e;
    });
  }

  _updateSequence(host, subscriptions) {
    const hostlog = debug(`subscriber:${host}`);
    let loggedIn = true;
    return promises.each(subscriptions, (sub) => {
      if (sub.isLoginRequired && !loggedIn) {
        hostlog(`Skipping login required ${sub.id}`, sub);
        return true;
      }

      hostlog(`Fetching feed for ${sub.id}`, sub);
      return sub.update().then(() => {
        hostlog(`Fetched feed for ${sub.id}`, sub);
      }).catch((err) => {
        if (err.name === "LoginRequiredError") {
          loggedIn = false;
          hostlog(`Skipped login required ${sub.id}`);
        } else {
          console.error(`Error occurred for ${sub.id}`, err);
        }
        // Ignore error and continue to the next subscription.
      });
    });
  }

  /**
   * Clear specific unread item in ItemsSubscription.
   *
   * @param {ItemsSubscription} subscription
   * @param {FeedItem} item
   */
  clearUnreadItem(subscription, item) {
    if (_.isString(subscription)) {
      subscription = _.find(this.itemsSubscriptions, ["id", subscription]);
    }
    if (subscription) {
      if (subscription.clearUnreadItem(item)) {
        this.emit("update");
      }
    }
  }

  /**
   * Clear all unread items in ItemsSubscription.
   */
  clearUnreadItems() {
    _.each(this.itemsSubscriptions, sub => {
      sub.clearUnreadItems();
    });
    this.emit("update");
  }

  /**
   * Get total count of unread items in ItemsSubscription.
   *
   * @return {number} Total unread items count.
   */
  getUnreadItemsCount() {
    return _.sumBy(this.itemsSubscriptions, "unreadItemsCount");
  }
}
