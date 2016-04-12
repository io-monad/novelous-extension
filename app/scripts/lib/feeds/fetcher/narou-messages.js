import _ from "lodash";
import Feed from "../feed";
import Narou from "../../sites/narou";
import { translate } from "../../util/chrome-util";

/**
 * Feed fetcher of received messages in Narou
 *
 * @implements FeedFetcher
 */
export default class FetcherNarouMessages {
  isLoginRequired() {
    return true;
  }

  fetchFeed() {
    return this._fetchItems().then(items => {
      return new Feed({
        title: translate("narouMessagesFeed"),
        url: Narou.URL.getMyReceivedMessagesURL(),
        siteName: translate(Narou.name),
        siteId: Narou.name,
        items,
      });
    });
  }

  _fetchItems() {
    return Narou.API.listMyReceivedMessages().then(messages => {
      return _.map(messages, msg => ({
        id: msg.id,
        title: msg.title,
        url: msg.url,
        type: "message",
        authorName: msg.userName,
        authorUrl: msg.userUrl,
        createdAt: msg.createdAt,
      }));
    });
  }
}
