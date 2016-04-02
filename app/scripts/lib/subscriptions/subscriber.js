import EventEmitter from "eventemitter3";
import promises from "../util/promises";

/**
 * Subscriber holds subscription list and update them from remote sites.
 */
export default class Subscriber extends EventEmitter {
  /**
   * @param {Object.<string, Site>} sites - A map of site name and Site object.
   * @param {Object} settings - Settings.
   * @param {Subscription[]} settings.subscriptions
   * @param {number} settings.fetchInterval
   */
  constructor(sites, settings) {
    super();
    this.sites = sites;

    settings = _.extend({
      subscriptions: [],
      fetchInterval: 1000,
    }, settings);
    this.subscriptions = settings.subscriptions;
    this.fetchInterval = settings.fetchInterval;

    this._handleSubscriptionUpdate = this._handleSubscriptionUpdate.bind(this);
    _.each(this.subscriptions, sub => sub.on("update", this._handleSubscriptionUpdate));
  }

  /**
   * Subscribe a new subscription.
   *
   * @param {Subscription} subscription
   */
  subscribe(subscription) {
    this.subscriptions.push(subscription);
    subscription.on("update", this._handleSubscriptionUpdate);
    this.emit("update");
  }

  /**
   * Unsubscribe a subscription.
   *
   * @param {Subscription} subscription
   */
  unsubscribe(subscription) {
    subscription.removeListener("update", this._handleSubscriptionUpdate);
    _.pull(this.subscriptions, subscription);
    this.emit("update");
  }

  /**
   * Update all subscriptions.
   *
   * @return {Promise.<Subscriber>}
   */
  updateAll() {
    return new Promise((resolve, reject) => {
      // To be in good manner, we should have one request per site at once.
      const sitesToSubs = _.groupBy(this.subscriptions, "siteName");
      const promises = _.map(sitesToSubs, (subs, siteName) => {
        const logger = debug(`subscriber:${siteName}`);
        return this._updateSequence(subs, logger);
      });
      Promise.all(promises)
      .then(() => { resolve(this); })
      .catch(reject);
    });
  }

  /**
   * Update subscriptions in sequence.
   *
   * @param {Subscription[]} subscriptions
   * @param {Function} logger
   * @return {Promise}
   * @private
   */
  _updateSequence(subscriptions, logger) {
    logger(`Updating ${subscriptions.length} subscriptions`);
    return promises.each(subscriptions, { interval: this.fetchInterval }, (sub) => {
      const site = this.sites[sub.siteName];
      if (!site) {
        return Promise.reject(`Unknown site name: ${sub.siteName}`);
      }

      logger(`Fetching data for ${sub.id}`);
      return site.getItem(sub.itemType, sub.itemId).then((item) => {
        logger(`Fetched data for ${sub.id}:`, item);
        sub.item = item;
      }).catch((err) => {
        logger(`Error occurred for ${sub.id}:`, err);
      });
    });
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
