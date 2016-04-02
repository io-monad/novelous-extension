import EventEmitter from "eventemitter3";
import buildDebug from "debug";

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
    settings = settings || {};
    this.sites = sites;
    this.subscriptions = settings.subscriptions || [];
    this.fetchInterval = settings.fetchInterval || 1000;

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
        const logger = buildDebug(`subscriber:${siteName}`);
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
   * @return {Promise}
   * @private
   */
  _updateSequence(subscriptions, logger) {
    if (subscriptions.length === 0) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const queue = _.clone(subscriptions);
      const updateNext = () => {
        const sub = queue.shift();

        if (!this.sites[sub.siteName]) {
          reject(`Unknown site name: ${sub.siteName}`);
        }

        logger(`Fetching data for ${sub.id}`);
        this.sites[sub.siteName].getItem(sub.itemType, sub.itemId)
        .then((item) => {
          logger(`Fetched data for ${sub.id}:`, item);
          sub.item = item;

          if (queue.length === 0) {
            resolve();
          } else {
            setTimeout(updateNext, this.fetchInterval);
          }
        })
        .catch((err) => {
          logger(`Error occurred for ${sub.id}:`, err);
          reject(err);
        });
      };
      updateNext();
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
