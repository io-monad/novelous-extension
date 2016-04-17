import { _, factory, sinonsb } from "../../common";
import Feed from "../../../app/scripts/lib/feeds/feed";

export default class FeedTestHelpers {
  static cloneFeed(feed) {
    return new Feed(_.cloneDeep(feed.toObject()));
  }

  static getFeedWithNewItem(feed, itemType) {
    const newFeedItem = factory.buildSync(itemType || "feedItem");
    const newFeed = this.cloneFeed(feed);
    newFeed.items.push(newFeedItem);
    return [newFeed, newFeedItem];
  }

  static getFeedWithNewItems(feed, num, itemType) {
    const newFeedItems = _.times(num, () => factory.buildSync(itemType || "feedItem"));
    const newFeed = this.cloneFeed(feed);
    Array.prototype.push.apply(newFeed.items, newFeedItems);
    return [newFeed, newFeedItems];
  }

  static stubFetchFeed(sub, feed) {
    if (sub._feedFetcher.fetchFeed.returns) {
      return sub._feedFetcher.fetchFeed.returns(Promise.resolve(feed));
    }
    return sinonsb.stub(sub._feedFetcher, "fetchFeed")
      .returns(Promise.resolve(feed));
  }

  static restoreStubFetchFeed(sub) {
    if (sub._feedFetcher.fetchFeed.restore) {
      sub._feedFetcher.fetchFeed.restore();
    }
  }

  static updateSubscriptionWithRandomStats(sub, { num = 1, startTime = 0, customFeed } = {}) {
    const nowStub = sinonsb.stub(_, "now");
    let promise = Promise.resolve();

    const entries = _.times(num, n => {
      const time = startTime + n * 24 * 60 * 60 * 1000;
      const feed = this.cloneFeed(sub.feed);
      _.each(feed.items, item => {
        item.stats = factory.buildSync("novelFeedItemStats");
      });
      if (customFeed) customFeed(feed);

      promise = promise.then(() => {
        nowStub.returns(time);
        this.stubFetchFeed(sub, feed);
        return sub.update();
      });
      return { time, feed };
    });

    return promise.then(() => {
      nowStub.restore();
      this.restoreStubFetchFeed(sub);
      return entries;
    });
  }
}
