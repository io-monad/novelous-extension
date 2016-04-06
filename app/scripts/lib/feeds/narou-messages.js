import Feed from "./feed";
import NarouMyMessageLister from "../sites/narou/my-message-lister";
import { translate } from "../util/chrome-util";

/**
 * Feed of received messages in Narou
 */
export default class NarouMessagesFeed extends Feed {
  constructor(data) {
    data = data || {};
    const lister = new NarouMyMessageLister(data.options);
    super({
      title: translate("narouMessagesFeed"),
      pageUrl: lister.getURL(),
      siteName: translate("narouSiteName"),
    }, data);
    this.lister = lister;
  }

  _fetchItemsFromServer() {
    return this.lister.listReceivedMessages().then(messages => {
      return _.map(messages, msg => ({
        id: msg.id,
        title: msg.title,
        url: msg.url,
        userName: msg.userName,
        userUrl: msg.userUrl,
        createdAt: msg.createdAt,
      }));
    });
  }
}
