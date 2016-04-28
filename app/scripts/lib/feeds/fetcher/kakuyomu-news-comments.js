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
        version: 2,
        title: translate("kakuyomuNewsCommentsFeed"),
        url: Kakuyomu.URL.getMyTopURL(),
        siteName: translate(Kakuyomu.name),
        siteId: Kakuyomu.name,
        items,
      });
    });
  }

  _fetchItems() {
    return Kakuyomu.API.listMyNewsComments().then(comments => {
      return _.map(comments, com => ({
        id: com.id,
        title: translate("kakuyomuNewsCommentTitle", [com.userName]),
        url: com.url,
        body: com.body,
        type: "comment",
        authorName: com.userName,
        authorUrl: com.userUrl,
        sourceTitle: com.articleTitle,
        sourceUrl: com.articleUrl,
        sourceType: "news",
      }));
    });
  }
}
