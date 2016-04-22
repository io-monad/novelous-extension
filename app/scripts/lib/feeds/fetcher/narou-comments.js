import _ from "lodash";
import { translate } from "@io-monad/chrome-util";
import Feed from "../feed";
import Narou from "../../sites/narou";

/**
 * Feed fetcher of received comments in Narou
 *
 * @implements {FeedFetcher}
 */
export default class FetcherNarouComments {
  isLoginRequired() {
    return true;
  }

  fetchFeed() {
    return this._fetchItems().then(items => {
      return new Feed({
        title: translate("narouCommentsFeed"),
        url: Narou.URL.getMyReceivedCommentsURL(),
        siteName: translate(Narou.name),
        siteId: Narou.name,
        items,
      });
    });
  }

  _fetchItems() {
    return Narou.API.listMyReceivedComments().then(comments => {
      return _.map(comments, com => ({
        id: com.id,
        title: translate("narouCommentTitle", [com.userName]),
        url: com.replyUrl,
        body: com.body,
        type: "comment",
        authorName: com.userName,
        authorUrl: com.userUrl,
        sourceTitle: com.novelTitle,
        sourceUrl: com.novelUrl,
        sourceType: "novel",
        createdAt: com.createdAt,
      }));
    });
  }
}
