import Feed from "../feeds/feed";
import FetcherFactory from "../feeds/fetcher-factory";
import WatchStrategies from "./watch-strategies";

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
   * @param {Object}  [data.fetchOptions] - Options for feed fetcher.
   * @param {string}  [data.watch="set"] - Watch strategy name.
   * @param {Object}  [data.watchState] - Watch strategy state.
   * @param {Object}  [data.watchOptions] - Options for watch strategy.
   * @param {boolean} [data.enabled=true] - `false` if disabled.
   * @param {number}  [data.lastUpdatedAt] - Timestamp of last update.
   */
  constructor(data = {}) {
    this.data = _.extend({
      feedUrl: null,
      feedData: null,
      fetchOptions: null,
      watch: "set",
      watchState: null,
      watchOptions: null,
      enabled: true,
      lastUpdatedAt: null,
    }, data);
    this._feed = this.data.feedData && new Feed(this.data.feedData);
    this._feedFetcher = FetcherFactory.create(this.data.feedUrl, this.data.fetchOptions);
    this._watchStrategy = WatchStrategies.create(this.data.watch, this.data.watchOptions);
  }

  toObject() {
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

  get feed() {
    return this._feed;
  }
  set feed(newFeed) {
    if (this._feed !== newFeed) {
      this._feed = newFeed;
      this.data.feedData = newFeed ? newFeed.toObject() : null;
      this._newItems = null;  // Clear cache
    }
  }

  get title() {
    return this.feed && this.feed.title;
  }
  get url() {
    return this.feed && this.feed.url;
  }
  get siteName() {
    return this.feed && this.feed.siteName;
  }
  get items() {
    return this.feed ? this.feed.items : [];
  }

  get newItems() {
    if (!this._newItems) {
      if (!this.feed) {
        this._newItems = [];
      } else {
        this._newItems = this._watchStrategy.filterNewItems(this.feed.items, this.data.watchState);
      }
    }
    return this._newItems;
  }
  get newItemsCount() {
    return this.newItems.length;
  }

  /**
   * Update feed by fetching from the server.
   *
   * @return {Promise}
   */
  update() {
    return this._feedFetcher.fetchFeed(this.feedUrl).then(feed => {
      const isFirstFetch = !this.data.feedData;
      this.feed = feed;
      this.data.lastUpdatedAt = _.now();
      if (isFirstFetch) this.clearNewItems();
    });
  }

  /**
   * Clear new items in feed to mark them as have seen.
   */
  clearNewItems() {
    if (this.feed) {
      this.data.watchState = this._watchStrategy.getClearedState(this.feed.items);
    }
    this._newItems = null;
  }
}
