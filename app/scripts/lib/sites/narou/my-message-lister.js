import narouMeta from "./meta.json";
import scrape from "../../util/scrape";
import url from "url";

/**
 * @typedef {Object} NarouMyMessage
 * @property {string}  id - ID of the message.
 * @property {string}  title - Title of the message.
 * @property {string}  url - URL of the message.
 * @property {string}  userName - Name of the user who sent the message.
 * @property {string}  userUrl - URL of the user who sent the message.
 * @property {string}  createdAt - Timestamp when the message was sent.
 */

/**
 * Listing received messages in Narou.
 */
export default class NarouMyMessageLister {
  /**
   * @param {Object} [options] - Options.
   * @param {string} [options.baseUrl] - A base URL of Narou.
   */
  constructor(options) {
    options = _.extend({}, narouMeta, options);
    this.baseUrl = options.baseUrl;
  }

  /**
   * Get a list of received messages from Narou.
   *
   * @return {Promise.<NarouMyMessage[]>}
   */
  listReceivedMessages() {
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
    return _.map($("#messagelist tr.message_check_list"), (item) => {
      const $item = $(item);
      const message = {};
      message.title = $.text($item.find("td.subject"));
      message.url = url.resolve(this.baseUrl, $item.find("td.subject > a").attr("href"));
      message.id = message.url.match(/meskey\/([^\/]+)/)[1];
      message.userName = $.text($item.find("td.name"));
      message.userUrl = $item.find("td.name > a").attr("href");
      message.createdAt = $.localTime($item.find("td:last"));
      return message;
    });
  }
}
