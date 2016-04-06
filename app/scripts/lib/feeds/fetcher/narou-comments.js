import Feed from "../feed";
import NarouMyCommentLister from "../../sites/narou/my-comment-lister";
import { translate } from "../../util/chrome-util";

/**
 * Feed fetcher of received comments in Narou
 *
 * @implements FeedFetcher
 */
export default class FetcherNarouComments {
  constructor(options) {
    this.lister = new NarouMyCommentLister(options);
  }

  fetchFeed() {
    return this._fetchItems().then(items => {
      return new Feed({
        title: translate("narouCommentsFeed"),
        url: this.lister.getURL(),
        siteName: translate("narouSiteName"),
        items,
      });
    });
  }

  _fetchItems() {
    return this.lister.listReceivedComments().then(comments => {
      return _.map(comments, com => ({
        id: com.id,
        title: translate("narouCommentTitle", [com.userName]),
        url: com.replyUrl,
        body: com.body,
        authorName: com.userName,
        authorUrl: com.userUrl,
        sourceTitle: com.novelTitle,
        sourceUrl: com.novelUrl,
        createdAt: com.createdAt,
      }));
    });
  }
}
