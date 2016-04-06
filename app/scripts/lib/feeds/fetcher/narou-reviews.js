import Feed from "../feed";
import NarouMyReviewLister from "../../sites/narou/my-review-lister";
import { translate } from "../../util/chrome-util";

/**
 * Feed fetcher of received reviews in Narou
 *
 * @implements FeedFetcher
 */
export default class FetcherNarouReviews {
  constructor(options) {
    this.lister = new NarouMyReviewLister(options);
  }

  fetchFeed() {
    return this._fetchItems().then(items => {
      return new Feed({
        title: translate("narouReviewsFeed"),
        url: this.lister.getURL(),
        siteName: translate("narouSiteName"),
        items,
      });
    });
  }

  _fetchItems() {
    return this.lister.listReceivedReviews().then(reviews => {
      return _.map(reviews, review => ({
        id: review.id,
        title: review.title,
        url: this.pageUrl,
        body: review.body,
        authorName: review.userName,
        authorUrl: review.userUrl,
        sourceTitle: review.novelTitle,
        sourceUrl: review.novelUrl,
        createdAt: review.createdAt,
      }));
    });
  }
}
