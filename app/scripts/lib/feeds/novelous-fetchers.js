/**
 * Map of novelous-feed:// protocol feed fetchers.
 *
 * [host][path] => FeedFetcher class getter function
 *
 * @name NovelousFetchers
 * @type {Map.<string, Map.<string, Function>>}
 */
export default {
  narou: {
    "/messages": () => require("./fetcher/narou-messages").default,
    "/comments": () => require("./fetcher/narou-comments").default,
    "/reviews": () => require("./fetcher/narou-reviews").default,
  },
  kakuyomu: {
    "/reviews": () => require("./fetcher/kakuyomu-reviews").default,
  },
};
