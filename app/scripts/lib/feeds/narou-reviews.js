import Feed from "./feed";
import NarouMyReviewLister from "../sites/narou/my-review-lister";
import { translate } from "../util/chrome-util";

/**
 * Feed of received reviews in Narou
 */
export default class NarouReviewsFeed extends Feed {
  constructor(data) {
    data = data || {};
    const lister = new NarouMyReviewLister(data.options);
    super({
      title: translate("narouReviewsFeed"),
      pageUrl: lister.getURL(),
      siteName: translate("narouSiteName"),
    }, data);
    this.lister = lister;
  }

  _fetchItemsFromServer() {
    return this.lister.listReceivedReviews().then(reviews => {
      return _.map(reviews, review => ({
        id: review.id,
        title: review.title,
        url: this.pageUrl,
        body: review.body,
        userName: review.userName,
        userUrl: review.userUrl,
        novelTitle: review.novelTitle,
        novelUrl: review.novelUrl,
        createdAt: review.createdAt,
      }));
    });
  }
}
