import _ from "lodash";
import { translate } from "@io-monad/chrome-util";
import Feed from "../feed";
import Narou from "../../sites/narou";

/**
 * Feed fetcher of received comments in author's blog in Narou
 *
 * @implements {FeedFetcher}
 */
export default class FetcherNarouBlogComments {
  isLoginRequired() {
    return true;
  }

  fetchFeed() {
    return this._fetchItems().then(items => {
      return new Feed({
        title: translate("narouBlogCommentsFeed"),
        url: Narou.URL.getMyReceivedBlogCommentsURL(),
        siteName: translate(Narou.name),
        siteId: Narou.name,
        items,
      });
    });
  }

  _fetchItems() {
    return Narou.API.listMyReceivedBlogComments().then(comments => {
      return _.map(comments, com => ({
        id: com.id,
        title: translate("narouBlogCommentTitle", [com.userName]),
        body: com.body,
        type: "comment",
        authorName: com.userName,
        authorUrl: com.userUrl,
        sourceTitle: com.articleTitle,
        sourceUrl: com.articleUrl,
        sourceType: "blog",
        createdAt: com.createdAt,
      }));
    });
  }
}
