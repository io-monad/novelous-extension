import _ from "lodash";
import Feed from "../feed";
import Narou from "../../sites/narou";
import { translate } from "../../util/chrome-util";

/**
 * Feed fetcher of received reviews in Narou
 *
 * @implements FeedFetcher
 */
export default class FetcherNarouReviews {
  isLoginRequired() {
    return true;
  }

  fetchFeed() {
    return this._fetchItems().then(items => {
      return new Feed({
        title: translate("narouReviewsFeed"),
        url: Narou.URL.getMyReceivedReviewsURL(),
        siteName: translate(Narou.name),
        siteId: Narou.name,
        items,
      });
    });
  }

  _fetchItems() {
    return Narou.API.listMyReceivedReviews().then(reviews => {
      return _.map(reviews, review => ({
        id: review.id,
        title: review.title,
        url: Narou.URL.getMyReceivedReviewsURL(),
        body: review.body,
        type: "review",
        authorName: review.userName,
        authorUrl: review.userUrl,
        sourceTitle: review.novelTitle,
        sourceUrl: review.novelUrl,
        sourceType: "novel",
        createdAt: review.createdAt,
      }));
    });
  }
}
