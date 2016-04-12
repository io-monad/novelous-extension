import url from "url";
import _ from "lodash";
import scrape from "../../util/scrape";
import SiteClient from "../site-client";
import narouMeta from "./meta.json";

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
   * @param {SiteClient} [options.client] - SiteClient used to fetch content.
   */
  constructor(options) {
    options = options || {};
    this.baseUrl = options.baseUrl || narouMeta.baseUrl;
    this.client = options.client || new SiteClient;
  }

  /**
   * Get a list of received messages from Narou.
   *
   * @return {Promise.<NarouMyMessage[]>}
   */
  listReceivedMessages() {
    return this.client.fetch(this.getURL())
      .then(scrape).then($ => this._parsePage($));
  }

  getURL() {
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
      message.createdAt = $.localTime($item.find("td").last());
      return message;
    });
  }
}
