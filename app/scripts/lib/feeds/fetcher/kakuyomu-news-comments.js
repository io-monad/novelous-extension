import _ from "lodash";
import { translate } from "@io-monad/chrome-util";
import Feed from "../feed";
import Kakuyomu from "../../sites/kakuyomu";

/**
 * Feed fetcher of received comments to author's news in Kakuyomu
 *
 * @implements {FeedFetcher}
 */
export default class FetcherKakuyomuNewsComments {
  isLoginRequired() {
    return true;
  }

  fetchFeed() {
    return this._fetchItems().then(items => {
      return new Feed({
        title: translate("kakuyomuNewsCommentsFeed"),
        url: Kakuyomu.URL.getMyTopURL(),
        siteName: translate(Kakuyomu.name),
        siteId: Kakuyomu.name,
        items,
      });
    });
  }

  _fetchItems() {
    return Kakuyomu.API.getMyUser().then(user => {
      if (!user.newsCommentEnabled) {
        // Skip fetching items when comments disabled
        return [];
      }

      return Kakuyomu.API.listNewsByUserId(user.id).then(newsList =>
        _.flatMap(newsList, news => this._buildItem(user, news))
      );
    });
  }

  _buildItem(user, news) {
    if (news.commentCount === 0) return [];
    return {
      id: `${news.id}-${news.commentCount}`,
      title: translate("kakuyomuNewsCommentTitle", [news.commentCount]),
      url: news.url,
      type: "comment",
      sourceTitle: news.title,
      sourceUrl: news.url,
      sourceType: "news",
    };
  }
}
