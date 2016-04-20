import _ from "lodash";
import Subscription from "../subscription";

/**
 * @typedef {Object} ItemsSubscriptionData
 * @extends SubscriptionData
 * @property {?string[]} readItemIds - IDs of read items.
 */

/**
 * Subscription for new items in a feed.
 *
 * It checks new items in the feed.
 */
export default class ItemsSubscription extends Subscription {
  /**
   * @param {ItemsSubscriptionData} data - Subscription data.
   */
  constructor(data = {}) {
    super(data);
    this._readItemIds = new Set(this.data.readItemIds || []);
    this._lastFoundItems = [];
  }

  toObject() {
    const output = super.toObject();
    output.readItemIds = Array.from(this._readItemIds);
    return output;
  }

  _clearCache() {
    this._unreadItems = null;
    this._readItems = null;
  }

  get feed() {
    return this._feed;
  }
  set feed(newFeed) {
    if (this._feed !== newFeed) {
      this._feed = newFeed;
      this._clearCache();
    }
  }

  get unreadItems() {
    if (!this._unreadItems) {
      this._unreadItems = _.reject(this.items, it => this._readItemIds.has(it.id));
    }
    return this._unreadItems;
  }
  get unreadItemsCount() {
    return this.unreadItems.length;
  }
  get readItems() {
    if (!this._readItems) {
      this._readItems = _.differenceBy(this.items, this.unreadItems, "id");
    }
    return this._readItems;
  }
  get readItemsCount() {
    return this.readItems.length;
  }
  get lastFoundItems() {
    return this._lastFoundItems;
  }
  get lastFoundItemsCount() {
    return this.lastFoundItems.length;
  }

  update() {
    const oldFeed = this.feed;
    this._lastFoundItems = [];
    return super.update().then(feed => {
      if (oldFeed) {
        this._lastFoundItems = _.differenceBy(this.items, oldFeed.items, "id");
      } else {
        // Clear all unread items on first fetch
        this.clearUnreadItems();
      }
      return feed;
    });
  }

  /**
   * Clear an item in feed to mark it as read.
   *
   * @param {FeedItem|string} item - Feed item or item ID to be cleared.
   * @return {boolean} `true` if the item was cleared successfully.
   */
  clearUnreadItem(item) {
    if (!this.feed) return false;

    const itemId = _.isString(item) ? item : item.id;
    const found = _.some(this.items, it => it.id === itemId);
    if (!found) return false;

    this._readItemIds.add(itemId);
    this._clearCache();
    return true;
  }

  /**
   * Clear all unread items in feed to mark them as read.
   */
  clearUnreadItems() {
    if (!this.feed) return;
    this._readItemIds.clear();
    this.feed.items.forEach(it => this._readItemIds.add(it.id));
    this._clearCache();
  }
}
