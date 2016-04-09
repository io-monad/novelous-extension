import _ from "lodash";

/**
 * @typedef {Object} FeedItem
 * @property {string}   id - ID of the item.
 * @property {string}   title - Title of the item.
 * @property {?string}  url - URL of the page to view the item.
 * @property {?string}  body - Body of the item. Plain text.
 * @property {?string}  type - Type of the item like "comment", "review", etc.
 * @property {?string}  authorName - Name of the author who created the item.
 * @property {?string}  authorUrl - URL of the author page.
 * @property {?string}  sourceTitle - Title of the source such as a novel.
 * @property {?string}  sourceUrl - URL of the source such as a novel.
 * @property {?string}  sourceType - Type of the source like "novel", "blog", etc.
 * @property {?string}  imageUrl - URL of the image attached to the item.
 * @property {?number}  createdAt - Timestamp when the item was created.
 * @property {?number}  updatedAt - Timestamp when the item was updated.
 */

/**
 * Feed value object that holds meta data and items fetched from the server.
 */
export default class Feed {
  /**
   * @param {Object} data - Feed data.
   * @param {string} data.title - Title of the feed.
   * @param {string} data.url - URL of the page to view the feed contents.
   * @param {string} data.siteName - Name of the site.
   * @param {?string} data.siteId - ID of the site if it is Site in Novelous.
   * @param {FeedItem[]} data.items - Feed items in the feed.
   */
  constructor(data) {
    this.data = _.extend({
      title: null,
      url: null,
      siteName: null,
      siteId: null,
      items: [],
    }, data);
  }

  /**
   * Get a plain object of feed data for serialization.
   *
   * @return {Object}
   */
  toObject() {
    return this.data;
  }

  /**
   * @return {string} Title of the feed.
   */
  get title() {
    return this.data.title;
  }

  /**
   * @return {string} URL of the page to view the feed contents.
   */
  get url() {
    return this.data.url;
  }

  /**
   * @return {string} Name of the site where the feed is fetched from.
   */
  get siteName() {
    return this.data.siteName;
  }

  /**
   * @return {string|null} ID of the site if it is Site in Novelous. Otherwise `null`.
   */
  get siteId() {
    return this.data.siteId;
  }

  /**
   * @return {FeedItem[]} Items in the feed.
   */
  get items() {
    return this.data.items;
  }
}
