import Feed from "../feed";
import KakuyomuMyNovelLister from "../../sites/kakuyomu/my-novel-lister";
import { translate } from "../../util/chrome-util";

/**
 * Feed fetcher of received reviews in Kakuyomu
 *
 * @implements FeedFetcher
 */
export default class FetcherKakuyomuReviews {
  constructor(options) {
    this.lister = new KakuyomuMyNovelLister(options);
  }

  isLoginRequired() {
    return true;
  }

  fetchFeed() {
    return this._fetchItems().then(items => {
      return new Feed({
        title: translate("kakuyomuReviewsFeed"),
        url: this.lister.getURL(),
        siteName: translate("kakuyomuSiteName"),
        siteId: "kakuyomu",
        items,
      });
    });
  }

  _fetchItems() {
    return this.lister.listNovels().then(novels => {
      return _.flatMap(novels, novel => {
        return _.map(novel.reviews || [], review => ({
          id: review.id,
          title: `${review.rating} ${review.title}`,
          url: review.url,
          body: review.body,
          type: "review",
          authorName: review.authorName,
          authorUrl: review.authorUrl,
          sourceTitle: novel.title,
          sourceUrl: novel.url,
          sourceType: "novel",
          createdAt: review.createdAt,
        }));
      });
    });
  }
}
