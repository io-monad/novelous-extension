import EventEmitter from "eventemitter3";
import FeedFactory from "../feeds/feed-factory";

/**
 * Subscription of novel sites.
 */
export default class Subscription extends EventEmitter {
  /**
   * @param {Object}  settings - Settings.
   * @param {string}  settings.feedName - Feed name.
   * @param {Object}  [settings.feedData] - Feed data.
   * @param {boolean} [settings.enabled=true] - `false` if disabled.
   * @param {number}  [settings.lastUpdatedAt] - Timestamp of last update.
   */
  constructor(settings = {}) {
    super();
    this.settings = _.defaults(settings, {
      feedName: null,
      feedData: null,
      enabled: true,
      lastUpdatedAt: null,
    });
    this._feed = FeedFactory.create(this.settings.feedName, this.settings.feedData);
  }

  toObject() {
    const obj = _.clone(this.settings);
    obj.feedData = this.feed.getData();
    return obj;
  }

  get id() {
    return this.settings.feedName;
  }
  get feedName() {
    return this.settings.feedName;
  }
  get feed() {
    return this._feed;
  }
  get enabled() {
    return this.settings.enabled;
  }
  get lastUpdatedAt() {
    return this.settings.lastUpdatedAt;
  }
  get updateCount() {
    return this.feed.updateCount;
  }

  /**
   * Update feed by fetching from the server.
   */
  update() {
    return this.feed.update().then(updated => {
      if (updated) {
        this.settings.lastUpdatedAt = _.now();
        this.emit("update", this);
      }
      return updated;
    });
  }

  /**
   * Clear new items in feed to mark them as have seen.
   */
  clearNewItems() {
    this.feed.clearNewItems();
    this.emit("clear", this);
  }
}
