import _ from "lodash";
import Feed from "../feeds/feed";
import FetcherFactory from "../feeds/fetcher-factory";

/**
 * Subscription of a feed.
 *
 * It holds a feed and checks new items in the feed.
 */
export default class Subscription {
  /**
   * @param {Object}  data - Subscription data.
   * @param {string}  data.feedUrl - Feed URL.
   * @param {Object}  [data.feedData] - Feed data (feed.toObject)
   * @param {Set}     [data.readItemIds] - Set of read item IDs.
   * @param {boolean} [data.enabled=true] - `false` if disabled.
   * @param {number}  [data.lastUpdatedAt] - Timestamp of last update.
   */
  constructor(data = {}) {
    this.data = _.extend({
      feedUrl: null,
      feedData: null,
      readItemIds: null,
      enabled: true,
      lastUpdatedAt: null,
    }, data);
    this._feed = this.data.feedData && new Feed(this.data.feedData);
    this._feedFetcher = FetcherFactory.create(this.data.feedUrl);
    this._readItemIds = new Set(this.data.readItemIds || []);
  }

  toObject() {
    this.data.feedData = this._feed ? this._feed.toObject() : null;
    this.data.readItemIds = Array.from(this._readItemIds);
    return _.clone(this.data);
  }

  get id() {
    return this.data.feedUrl;
  }
  get feedUrl() {
    return this.data.feedUrl;
  }
  get enabled() {
    return this.data.enabled;
  }
  get lastUpdatedAt() {
    return this.data.lastUpdatedAt;
  }

  get isLoginRequired() {
    return this._feedFetcher.isLoginRequired();
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

  get title() {
    return this.feed && this.feed.title || null;
  }
  get url() {
    return this.feed && this.feed.url || null;
  }
  get siteName() {
    return this.feed && this.feed.siteName || null;
  }
  get siteId() {
    return this.feed && this.feed.siteId || null;
  }
  get items() {
    return this.feed && this.feed.items || [];
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
    return this._lastFoundItems || (this._lastFoundItems = []);
  }
  get lastFoundItemsCount() {
    return this.lastFoundItems.length;
  }

  /**
   * Update feed by fetching from the server.
   *
   * @return {Promise.<FeedItem>} New items found by this update.
   */
  update() {
    return this._feedFetcher.fetchFeed(this.feedUrl).then(feed => {
      const oldFeed = this.feed;
      this.feed = feed;
      this.data.lastUpdatedAt = _.now();
      if (oldFeed) {
        this._lastFoundItems = _.differenceBy(this.items, oldFeed.items, "id");
      } else {
        this.clearUnreadItems();
        this._lastFoundItems = [];
      }
      return this._lastFoundItems;
    });
  }

  /**
   * Clear an item in feed to mark it as read.
   */
  clearUnreadItem(item) {
    if (!this.feed) return;
    this._readItemIds.add(_.isString(item) ? item : item.id);
    this._clearCache();
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

  _clearCache() {
    this._unreadItems = null;
    this._readItems = null;
    this._lastFoundItems = null;
  }
}
