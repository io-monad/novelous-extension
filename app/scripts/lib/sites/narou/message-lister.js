import narouMeta from "./meta.json";
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
   * @return {Promise} A promise that resolves to a list of messages.
   */
  listMessages() {
    return new Promise((resolve, reject) => {
      scrape.fetch(this._getURL())
      .then($ => { resolve(this._parsePage($)); })
      .catch(reject);
    });
  }

  _getURL() {
    return `${this.baseUrl}/messagebox/top/`;
  }

  _parsePage($) {
    const messageCount = $.number($("#location_menu .numItems"));

    const messages = _.map($("#messagelist tr.message_check_list"), (item) => {
      const $item = $(item);
      const message = {};

      message.senderName = $.text($item.find("td.name"));
      message.senderUrl = $item.find("td.name > a").attr("href");
      message.subject = $.text($item.find("td.subject"));
      message.url = url.resolve(this.baseUrl, $item.find("td.subject > a").attr("href"));
      message.createdAt = $.localTime($item.find("td:last"));

      return message;
    });

    return { messageCount, messages };
  }
}
