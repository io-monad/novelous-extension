import { _, factory, sinonsb } from "../../common";
import Feed from "../../../app/scripts/lib/feeds/feed";

export default {
  getFeedWithNewItem(feed) {
    const newFeedItem = factory.buildSync("feedItem");
    const newFeed = new Feed(_.cloneDeep(feed.toObject()));
    newFeed.items.push(newFeedItem);
    return [newFeed, newFeedItem];
  },
  getFeedWithNewItems(feed, num) {
    const newFeedItems = _.times(num, () => factory.buildSync("feedItem"));
    const newFeed = new Feed(_.cloneDeep(feed.toObject()));
    Array.prototype.push.apply(newFeed.items, newFeedItems);
    return [newFeed, newFeedItems];
  },
  stubFetchFeed(sub, feed) {
    return sinonsb.stub(sub._feedFetcher, "fetchFeed")
      .returns(Promise.resolve(feed));
  },
};
