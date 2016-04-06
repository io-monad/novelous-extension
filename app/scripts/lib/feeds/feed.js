import WatchStrategySet from "./watch/set";

/**
 * @typedef {Object} FeedItem
 * @property {string}   id - ID of the item.
 * @property {string}   title - Title of the item.
 * @property {?string}  url - URL to view the item.
 * @property {?string}  body - Body of the item. Plain text.
 * @property {?string}  userName - Name of the user who created the item.
 * @property {?string}  userUrl - URL of the user page.
 * @property {?string}  novelTitle - Title of the related novel.
 * @property {?string}  novelUrl - URL of the related novel.
 * @property {?number}  createdAt - Timestamp when the item was created.
 * @property {?number}  updatedAt - Timestamp when the item was updated.
 */

/**
 * Base class for feeds
 */
export default class Feed {
  /**
   * @param {Object} meta - Meta data of this feed.
   * @param {string} meta.title - Title of the feed.
   * @param {string} meta.pageUrl - URL of the page to view the feed contents.
   * @param {string} meta.siteName - Name of the site.
   * @param {WatchStrategy} [meta.watchStrategy] - Strategy to detect new items.
   * @param {Object} [data] - Feed data.
   * @param {FeedItem[]} [data.items] - Feed items fetched from server.
   * @param [data.watch] - Session data used by watchStrategy.
   */
  constructor(meta, data) {
    meta = meta || {};
    this.title = meta.title;
    this.pageUrl = meta.pageUrl;
    this.siteName = meta.siteName;
    this.watchStrategy = meta.watchStrategy || new WatchStrategySet;

    this.data = _.extend({
      items: null,
      watch: null,
    }, data);
    this.watchStrategy.session = this.data.watch;
  }

  /**
   * Get a plain object of feed data for serialization.
   *
   * @return {Object}
   */
  getData() {
    return {
      items: _.clone(this.data.items),
      watch: _.clone(this.watchStrategy.session),
    };
  }

  /**
   * @return {FeedItem[]} Feed items.
   */
  get items() {
    return this.data.items || [];
  }

  /**
   * @return {FeedItem[]} Feed items filtered to new items only.
   */
  get newItems() {
    return this.watchStrategy.getNewItems(this.items);
  }

  /**
   * @return {number} Number of updates for shown as a badge.
   */
  get updateCount() {
    return this.newItems.length;
  }

  /**
   * Clear new items to mark them as have seen.
   */
  clearNewItems() {
    this.watchStrategy.clearNewItems(this.items);
    this.data.watch = this.watchStrategy.session;
  }

  /**
   * Update items by fetching from the server.
   *
   * @return {Promise.<boolean>} `true` if items has been updated.
   */
  update() {
    return this._fetchItemsFromServer().then(items => {
      const isFirst = (this.data.items === null);
      const updated = !_.isEqual(items, this.items);
      this.data.items = items;

      if (isFirst) {
        // Clear new items on first update
        this.clearNewItems();
      }

      return updated;
    });
  }

  /**
   * Fetch items from the server.
   *
   * @return {Promise.<FeedItem[]>}
   * @abstract
   */
  _fetchItemsFromServer() {
    throw new Error("update must be overridden");
  }
}
