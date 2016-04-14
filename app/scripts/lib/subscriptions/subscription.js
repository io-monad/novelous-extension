import _ from "lodash";
import Feed from "../feeds/feed";
import FetcherFactory from "../feeds/fetcher-factory";

/**
 * @typedef {Object} SubscriptionData
 * @property {SubscriptionType} type - Subscription type.
 *     See {@link SubscriptionFactory} for details.
 * @property {string}    feedUrl - Feed URL.
 *     "novelous-feed://" protocol URLs are treated specially.
 *     See {@link FetcherFactory} for details.
 * @property {?FeedData} feedData - Feed data.
 * @property {?boolean}  enabled - `false` if disabled.
 * @property {?number}   lastUpdatedAt - Timestamp of last update.
 */

/**
 * Base class for subscription of a feed.
 *
 * It holds a feed and updates it by fetching feed from the server.
 */
export default class Subscription {
  /**
   * @param {SubscriptionData} data - Subscription data.
   */
  constructor(data = {}) {
    this.data = _.extend({
      type: null,
      feedUrl: null,
      feedData: null,
      enabled: true,
      lastUpdatedAt: null,
    }, data);
    this._feed = this.data.feedData && new Feed(this.data.feedData);
    this._feedFetcher = FetcherFactory.create(this.data.feedUrl);
  }

  /**
   * @return {SubscriptionData}
   */
  toObject() {
    this.data.feedData = this._feed ? this._feed.toObject() : null;
    return _.clone(this.data);
  }

  get type() {
    return this.data.type;
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
    this._feed = newFeed;
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

  /**
   * Update feed by fetching from the server.
   *
   * @return {Promise.<Feed>} Updated feed.
   */
  update() {
    return this._feedFetcher.fetchFeed(this.feedUrl).then(feed => {
      if (!_.isEqual(this.feed, feed)) {
        this.feed = feed;
        this.data.lastUpdatedAt = _.now();
      }
      return this.feed;
    });
  }
}
