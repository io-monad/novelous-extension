import NovelousFetchers from "./novelous-fetchers";
import url from "url";

/**
 * @interface FeedFetcher
 */
/**
 * Fetch a feed from the server.
 *
 * @function
 * @name FeedFetcher#fetchFeed
 * @param {string} feedUrl
 * @return {Promise.<Feed>} Promise of fetched feed.
 */

/**
 * Fetcher factory.
 */
export default {
  /**
   * Create a feed fetcher.
   *
   * @param {string} feedUrl - URL of the feed.
   * @param {Object} options - Options for the feed fetcher.
   * @return {FeedFetcher}
   */
  create(feedUrl, options) {
    const parsed = url.parse(feedUrl);
    if (!parsed.protocol) {
      throw new Error(`Invalid feed URL: ${feedUrl}`);
    }
    switch (parsed.protocol) {
      case "novelous-feed:":
        return createNovelousFetcher(parsed.host, parsed.path, options);
      default:
        throw new Error(`Not supported protocol: ${feedUrl}`);
    }
  },
};

function createNovelousFetcher(host, path, options) {
  const getter = _.get(NovelousFetchers, [host, path]);
  if (!getter) {
    throw new Error(`Unknown novelous-feed URL: novelous-feed://${host}${path}`);
  }
  const FeedClass = getter();
  return new FeedClass(options);
}
