import _ from "lodash";
import Feed from "../feed";
import KakuyomuMyNovelLister from "../../sites/kakuyomu/my-novel-lister";
import KakuyomuReviewLister from "../../sites/kakuyomu/review-lister";
import { translate } from "../../util/chrome-util";
import promises from "../../util/promises";

/**
 * Feed fetcher of received reviews in Kakuyomu
 *
 * @implements FeedFetcher
 */
export default class FetcherKakuyomuReviews {
  constructor(options) {
    options = _.extend({
      fetchInterval: 1000,
    }, options);
    this.novelLister = new KakuyomuMyNovelLister(options);
    this.reviewLister = new KakuyomuReviewLister(options);
    this.fetchInterval = options.fetchInterval;
  }

  isLoginRequired() {
    return true;
  }

  fetchFeed() {
    return this._fetchItems().then(items => {
      return new Feed({
        title: translate("kakuyomuReviewsFeed"),
        url: this.novelLister.getURL(),
        siteName: translate("kakuyomuSiteName"),
        siteId: "kakuyomu",
        items,
      });
    });
  }

  _fetchItems() {
    return this.novelLister.listNovels().then(novels =>
      promises.map(novels, { interval: this.fetchInterval }, novel =>
        this.reviewLister.listReviews(novel.id).then(reviews =>
          _.map(reviews, review => this._buildItem(novel, review))
        )
      )
      .then(_.flatten)
      .then(items => _.sortBy(items, it => -it.createdAt))
    );
  }

  _buildItem(novel, review) {
    return {
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
    };
  }
}
