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
    "/novels": () => require("./fetcher/narou-novels").default,
    "/messages": () => require("./fetcher/narou-messages").default,
    "/comments": () => require("./fetcher/narou-comments").default,
    "/blog-comments": () => require("./fetcher/narou-blog-comments").default,
    "/reviews": () => require("./fetcher/narou-reviews").default,
  },
  kakuyomu: {
    "/novels": () => require("./fetcher/kakuyomu-novels").default,
    "/reviews": () => require("./fetcher/kakuyomu-reviews").default,
  },
};
