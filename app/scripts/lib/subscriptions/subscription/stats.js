import _ from "lodash";
import Subscription from "../subscription";

const STATS_LOG_TTL = 1000 * 60 * 60 * 24 * 3;  // Limit stats to three days.

/**
 * @typedef {Object} StatsSubscriptionData
 * @extends SubscriptionData
 * @property {?Object.<string, StatsLog>} statsLogs
 *     Past stats for each item including the current stats.
 *     Keys are item IDs and values are {@link StatsLog}.
 */

/**
 * @typedef {Object} StatsLog
 * @property {number} timestamps - Array of timestamps when the log was added.
 * @property {Object.<string, number[]>} stats
 *     Each key is a key of FeedItem.stats object, and
 *     each value is a series of past values of FeedItem.stats object.
 *
 *     If a new key is added, past values are filled with `0` so that
 *     it keeps the same index with `timestamps`.
 *
 *     It only stores values of the past three days (`STATS_LOG_TTL`) and
 *     older values are removed automatically on update.
 */

/**
 * Subscription for stats of items in a feed.
 */
export default class StatsSubscription extends Subscription {
  static get STATS_LOG_TTL() { return STATS_LOG_TTL; }

  /**
   * @param {StatsSubscriptionData} data - Subscription data.
   */
  constructor(data = {}) {
    super(data);
    if (!this.data.statsLogs) this.data.statsLogs = {};
  }

  get statsLogs() {
    return this.data.statsLogs;
  }

  update() {
    return super.update().then(feed => {
      const logs = this.data.statsLogs || (this.data.statsLogs = {});
      this.items.forEach(item => {
        if (item.stats) {
          logs[item.id] = this._updateStatsLogs(logs[item.id], item.stats);
        }
      });
      this.data.lastUpdatedAt = _.now(); // Always update timestamp
      return feed;
    });
  }

  _updateStatsLogs(statsLogs, newStats) {
    statsLogs = _.defaults(statsLogs, {
      timestamps: [],
      stats: {},
    });

    const timestamp = _.now();

    // Remove expired timestamps
    const expired = ts => ts + STATS_LOG_TTL <= timestamp;
    const expiredCount = _.findLastIndex(statsLogs.timestamps, expired) + 1;
    statsLogs.timestamps.splice(0, expiredCount);

    // Add current timestamp
    const pastCount = statsLogs.timestamps.length;
    statsLogs.timestamps.push(timestamp);

    const updatedKeys = {};
    _.each(newStats, (value, key) => {
      // Skip non-number value
      if (isNaN(value)) return;

      let values = statsLogs.stats[key];
      if (values) {
        // Remove expired values
        values.splice(0, expiredCount);
      } else {
        // New key is found. Fill past logs with 0.
        values = statsLogs.stats[key] = Array(pastCount).fill(0);
      }

      // Add new value
      values.push(_.toNumber(value));
      updatedKeys[key] = true;
    });

    // Maintain not updated keys
    _.each(statsLogs.stats, (values, key) => {
      if (updatedKeys[key]) return;

      // Remove expired values
      values.splice(0, expiredCount);

      if (_.every(values, val => val === 0)) {
        // If every value is 0, then remove the key
        delete statsLogs.stats[key];
      } else {
        // Otherwise fill the current index with 0
        values.push(0);
      }
    });

    return statsLogs;
  }
}
