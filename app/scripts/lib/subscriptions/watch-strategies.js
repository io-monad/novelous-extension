import WatchStrategyNumber from "./watch/number";
import WatchStrategySet from "./watch/set";

/**
 * Map of watch strategies.
 */
const WatchStrategies = {
  set: WatchStrategySet,
  number: WatchStrategyNumber,
};

/**
 * @interface WatchStrategy
 */
/**
 * Filter feed items to new items only.
 *
 * @function
 * @name WatchStrategy#filterNewItems
 * @param {FeedItem[]} items - Feed items to be filtered.
 * @param {Object} state - State data used to find difference.
 * @return {FeedItem[]} Filtered items.
 */
/**
 * Get new state with all new items cleared as being seen by a user.
 *
 * @function
 * @name WatchStrategy#getAllClearedState
 * @param {FeedItem[]} items - All feed items in the feed.
 * @return {Object} State data that represents all items have been cleared.
 */
/**
 * Get new state with one new item cleared as being seen by a user.
 *
 * @function
 * @name WatchStrategy#getOneClearedState
 * @param {FeedItem} item - Feed item to be marked as seen.
 * @param {Object} prevState - Previous state.
 * @return {Object} State data that represents `item` has been cleared.
 */

/**
 * Watch strategy factory.
 */
export default {
  /**
   * Create a watch strategy.
   *
   * @param {string} name - Strategy name.
   * @param {Object} options - Options.
   */
  create(name, options) {
    const StrategyClass = WatchStrategies[name];
    if (!StrategyClass) {
      throw new Error(`Unknown strategy name: ${name}`);
    }
    return new StrategyClass(options);
  },
};
