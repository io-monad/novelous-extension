import url from "url";
import _ from "lodash";
import EventEmitter from "eventemitter3";
import promises from "../util/promises";
import Subscription from "./subscription";
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
   * This returns the same Promise for parallel runs.
   *
   * @return {Promise.<Subscriber>}
   */
  updateAll() {
    if (this._updatePromise) return this._updatePromise;

    logger("Updating all subscriptions");
    const subscriptions = _.filter(this.subscriptions, "enabled");
    const hostToSubscriptions = _.groupBy(subscriptions, sub => {
      return url.parse(sub.feedUrl).host || "other";
    });

    const updatePromises = _.map(
      hostToSubscriptions,
      (subs, host) => this._updateSequence(host, subs)
    );
    this._updatePromise = Promise.all(updatePromises).then(() => {
      logger("Updated all subscriptions");
      this._updatePromise = null;
      this.emit("update");
      return this;
    }).catch(e => {
      console.error("Error in subscriber.updateAll:", e);
      this._updatePromise = null;
      throw e;
    });
    return this._updatePromise;
  }

  _updateSequence(host, subscriptions) {
    const hostlog = debug(`subscriber:${host}`);
    let loggedIn = true;
    return promises.each(subscriptions, { interval: this.fetchInterval }, (sub) => {
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
