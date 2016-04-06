import Feed from "../feed";
import NarouMyMessageLister from "../../sites/narou/my-message-lister";
import { translate } from "../../util/chrome-util";

/**
 * Feed fetcher of received messages in Narou
 *
 * @implements FeedFetcher
 */
export default class FetcherNarouMessages {
  constructor(options) {
    this.lister = new NarouMyMessageLister(options);
  }

  fetchFeed() {
    return this._fetchItems().then(items => {
      return new Feed({
        title: translate("narouMessagesFeed"),
        url: this.lister.getURL(),
        siteName: translate("narouSiteName"),
        items,
      });
    });
  }

  _fetchItems() {
    return this.lister.listReceivedMessages().then(messages => {
      return _.map(messages, msg => ({
        id: msg.id,
        title: msg.title,
        url: msg.url,
        authorName: msg.userName,
        authorUrl: msg.userUrl,
        createdAt: msg.createdAt,
      }));
    });
  }
}
