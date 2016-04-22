import _ from "lodash";
import { translate } from "@io-monad/chrome-util";
import Feed from "../feed";
import Kakuyomu from "../../sites/kakuyomu";
import promises from "../../util/promises";

/**
 * Feed fetcher of received reviews in Kakuyomu
 *
 * @implements {FeedFetcher}
 */
export default class FetcherKakuyomuReviews {
  isLoginRequired() {
    return true;
  }

  fetchFeed() {
    return this._fetchItems().then(items => {
      return new Feed({
        title: translate("kakuyomuReviewsFeed"),
        url: Kakuyomu.URL.getMyTopURL(),
        siteName: translate(Kakuyomu.name),
        siteId: Kakuyomu.name,
        items,
      });
    });
  }

  _fetchItems() {
    return Kakuyomu.API.listMyNovels().then(novels =>
      promises.map(novels, novel =>
        Kakuyomu.API.listReviewsByNovelId(novel.id).then(reviews =>
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
