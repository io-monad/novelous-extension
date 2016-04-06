import Feed from "./feed";
import NarouMyCommentLister from "../sites/narou/my-comment-lister";
import { translate } from "../util/chrome-util";

/**
 * Feed of received comments in Narou
 */
export default class NarouCommentsFeed extends Feed {
  constructor(data) {
    data = data || {};
    const lister = new NarouMyCommentLister(data.options);
    super({
      title: translate("narouCommentsFeed"),
      pageUrl: lister.getURL(),
      siteName: translate("narouSiteName"),
    }, data);
    this.lister = lister;
  }

  _fetchItemsFromServer() {
    return this.lister.listReceivedComments().then(comments => {
      return _.map(comments, com => ({
        id: com.id,
        title: translate("narouCommentTitle", [com.userName]),
        url: com.replyUrl,
        body: com.body,
        userName: com.userName,
        userUrl: com.userUrl,
        novelTitle: com.novelTitle,
        novelUrl: com.novelUrl,
        createdAt: com.createdAt,
      }));
    });
  }
}
