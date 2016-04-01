import narouMeta from "./meta.json";
import MessageType from "./message-type";
import scrape from "../../util/scrape";
import url from "url";

/**
 * Listing received messages in Narou.
 */
export default class NarouMessageLister {
  /**
   * @param {string} [baseUrl] - A base URL of Narou.
   */
  constructor(baseUrl) {
    this.baseUrl = baseUrl || narouMeta.baseUrl;
  }

  /**
   * Get a list of messages from Narou.
   *
   * @param {string} [messageType="received"] - Type of messages to be fetched.
   * @return {Promise} A promise that resolves to a list of messages.
   */
  listMessages(messageType) {
    messageType = messageType || MessageType.RECEIVED;
    return new Promise((resolve, reject) => {
      scrape.fetch(this._getURL(messageType))
      .then($ => { resolve(this._parsePage($, messageType)); })
      .catch(reject);
    });
  }

  _getURL(messageType) {
    const boxId = ({
      [MessageType.RECEIVED]: "2",
      [MessageType.SENT]: "3",
    })[messageType] || "2";
    return `${this.baseUrl}/messagebox/top/nowfolder/${boxId}/`;
  }

  _parsePage($, messageType) {
    const messageCount = $.number($("#location_menu .numItems"));

    const messages = _.map($("#messagelist tr.message_check_list"), (item) => {
      const $item = $(item);
      const message = {};

      message.personName = $.text($item.find("td.name"));
      message.personUrl = $item.find("td.name > a").attr("href");
      message.subject = $.text($item.find("td.subject"));
      message.url = url.resolve(this.baseUrl, $item.find("td.subject > a").attr("href"));
      message.createdAt = $.localTime($item.find("td:last"));

      return message;
    });

    return { messageType, messageCount, messages };
  }
}
