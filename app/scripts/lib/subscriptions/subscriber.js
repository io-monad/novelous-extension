import EventEmitter from "eventemitter3";
import Subscription from "./subscription";
import promises from "../util/promises";
const logger = debug("subscriber");

/**
 * Subscriber holds subscription list and update them from remote sites.
 */
export default class Subscriber extends EventEmitter {
  /**
   * @param {Object[]} subscriptionSettings
   * @param {Object} settings - Settings.
   * @param {number} settings.fetchInterval
   */
  constructor(subscriptionSettings, settings) {
    super();
    settings = _.extend({
      fetchInterval: 1000,
    }, settings);

    this.subscriptionSettings = subscriptionSettings;
    this.fetchInterval = settings.fetchInterval;
  }

  /**
   * @return {Object[]}
   */
  get subscriptionSettings() {
    return _.invokeMap(this.subscriptions, "toObject");
  }

  /**
   * @param {Object[]} subscriptionSettings
   */
  set subscriptionSettings(subscriptionSettings) {
    this._subscriptions = _.map(subscriptionSettings || [], sub => new Subscription(sub));
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
   * Subscribe a new subscription.
   *
   * @param {Subscription|Subscription[]} subscription
   */
  subscribe(subscription) {
    this._subscriptions = this._subscriptions.concat(subscription);
    this.emit("update");
  }

  /**
   * Unsubscribe a subscription.
   *
   * @param {Subscription|Subscription[]} subscription
   */
  unsubscribe(subscription) {
    _.pullAll(this._subscriptions, _.castArray(subscription));
    this.emit("update");
  }

  /**
   * Update all subscriptions.
   *
   * @return {Promise.<Subscriber>}
   */
  updateAll() {
    logger("Updating all subscriptions");
    const subscriptions = _.filter(this.subscriptions, "enabled");
    return promises.each(subscriptions, { interval: this.fetchInterval }, (sub) => {
      logger(`Fetching feed for ${sub.id}`, sub);
      return sub.update().then(() => {
        logger(`Fetched feed for ${sub.id}`, sub);
      }).catch((err) => {
        console.error(`Error occurred for ${sub.id}`, err);
      });
    }).then(() => {
      logger("Updated all subscriptions");
      this.emit("update");
    });
  }

  /**
   * Clear all new items in subscriptions.
   */
  clearNewItems() {
    _.each(this.subscriptions, sub => {
      sub.clearNewItems();
    });
    this.emit("update");
  }

  /**
   * Get total count of new items in subscriptions.
   *
   * @return {number} Total new items count.
   */
  getNewItemsCount() {
    return _.sumBy(this.subscriptions, "newItemsCount");
  }
}
