import Feed from "../feed";
import NarouMyBlogCommentLister from "../../sites/narou/my-blog-comment-lister";
import { translate } from "../../util/chrome-util";

/**
 * Feed fetcher of received comments in author's blog in Narou
 *
 * @implements FeedFetcher
 */
export default class FetcherNarouBlogComments {
  constructor(options) {
    this.lister = new NarouMyBlogCommentLister(options);
  }

  fetchFeed() {
    return this._fetchItems().then(items => {
      return new Feed({
        title: translate("narouBlogCommentsFeed"),
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
        title: translate("narouBlogCommentTitle", [com.userName]),
        body: com.body,
        authorName: com.userName,
        authorUrl: com.userUrl,
        sourceTitle: com.articleTitle,
        sourceUrl: com.articleUrl,
        createdAt: com.createdAt,
      }));
    });
  }
}
