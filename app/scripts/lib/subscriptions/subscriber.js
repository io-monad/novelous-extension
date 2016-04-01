import EventEmitter from "eventemitter3";
import SiteFactory from "../sites/site-factory";

/**
 * Subscriber holds subscription list and update them from remote sites.
 */
export default class Subscriber extends EventEmitter {
  /**
   * @param {Object} settings - Settings.
   * @param {Object.<string, Site|boolean|Object>} settings.sites
   * @param {Subscription[]} settings.subscriptions
   * @param {number} settings.updateInterval
   */
  constructor(settings) {
    super();
    settings = settings || {};
    this.sites = SiteFactory.createMap(settings.sites || {});
    this.subscriptions = settings.subscriptions || [];
    this.updateInterval = settings.updateInterval || 1000;

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
   * @return {Promise}
   */
  updateAll() {
    // To be in good manner, we should have one request per site at once.
    const sitesToSubs = _.groupBy(this.subscriptions, "siteName");
    const promises = _.map(sitesToSubs, (subs) => {
      return this._updateSequence(subs);
    });
    return Promise.all(promises);
  }

  /**
   * Update subscriptions in sequence.
   *
   * @param {Subscription[]} subscriptions
   * @return {Promise}
   * @private
   */
  _updateSequence(subscriptions) {
    if (subscriptions.length === 0) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const queue = _.clone(subscriptions);
      const updateNext = () => {
        const sub = queue.shift();

        if (!this.sites[sub.siteName]) {
          reject(`Unknown site name: ${sub.siteName}`);
        }

        this.sites[sub.siteName].getItem(sub.itemType, sub.itemId)
        .then((item) => {
          sub.item = item;

          if (queue.length === 0) {
            resolve();
          } else {
            setTimeout(updateNext, this.updateInterval);
          }
        })
        .catch(reject);
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
