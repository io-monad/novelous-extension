import EventEmitter from "eventemitter3";
import promises from "../util/promises";
const logger = debug("subscriber");

/**
 * Subscriber holds subscription list and update them from remote sites.
 */
export default class Subscriber extends EventEmitter {
  /**
   * @param {Subscription[]} subscriptions
   * @param {Object} settings - Settings.
   * @param {number} settings.fetchInterval
   */
  constructor(subscriptions, settings) {
    super();
    settings = _.extend({
      fetchInterval: 1000,
    }, settings);

    this._handleSubscriptionUpdate = this._handleSubscriptionUpdate.bind(this);
    this.subscriptions = subscriptions;
    this.fetchInterval = settings.fetchInterval;
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
    if (this._subscriptions) {
      _.each(this._subscriptions, sub => {
        this._unbindEventsFromSubscription(sub);
      });
    }
    this._subscriptions = _.clone(subscriptions || []);
    _.each(this._subscriptions, sub => {
      this._bindEventsToSubscription(sub);
    });
    this.emit("update");
  }

  /**
   * Subscribe a new subscription.
   *
   * @param {Subscription} subscription
   */
  subscribe(subscription) {
    this.subscriptions.push(subscription);
    this._bindEventsToSubscription(subscription);
    this.emit("update");
  }

  /**
   * Unsubscribe a subscription.
   *
   * @param {Subscription} subscription
   */
  unsubscribe(subscription) {
    this._unbindEventsFromSubscription(subscription);
    _.pull(this.subscriptions, subscription);
    this.emit("update");
  }

  _bindEventsToSubscription(subscription) {
    subscription.removeListener("update", this._handleSubscriptionUpdate);
    subscription.on("update", this._handleSubscriptionUpdate);
  }

  _unbindEventsFromSubscription(subscription) {
    subscription.removeListener("update", this._handleSubscriptionUpdate);
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
      return sub.update().then(updated => {
        logger(`Fetched feed for ${sub.id}`, sub, updated);
      }).catch((err) => {
        console.error(`Error occurred for ${sub.id}`, err);
      });
    });
  }

  /**
   * Clear all new items in subscriptions.
   */
  clearNewItems() {
    _.each(this.subscriptions, sub => {
      sub.clearNewItems();
    });
    this.emit("clear");
  }

  /**
   * Handle update event from subscription.
   *
   * @private
   */
  _handleSubscriptionUpdate(sub) {
    this.emit("updateSubscription", sub);
  }
}
