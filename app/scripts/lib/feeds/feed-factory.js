import Feeds from "./feeds";

export default {
  /**
   * Create a Feed instance with given data.
   *
   * @param {string} feedName - Feed name (key of feeds)
   * @param {Object} feedData - Feed data.
   * @return {Feed} Created Feed instance.
   */
  create(feedName, feedData) {
    if (!Feeds[feedName]) {
      throw new Error(`Unknown feed name: ${feedName}`);
    }
    const FeedClass = Feeds[feedName]();
    return new FeedClass(feedData);
  },
};
