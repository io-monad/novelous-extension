import _ from "lodash";
import scrape from "../../../util/scrape";
import SiteClient from "../../site-client";
import KakuyomuURL from "../url";

/**
 * @typedef {Object} KakuyomuUserNews
 * @property {string}   id - ID of the news.
 * @property {string}   title - Title of the news.
 * @property {string}   url - URL of the novel.
 * @property {number}   commentCount - Count of comments in the news.
 * @property {number}   createdAt - Timestamp when the news was published.
 */

/**
 * Listing news (Kinkyou Note) of a user in Kakuyomu.
 */
export default class KakuyomuUserNewsLister {
  /**
   * @param {Object} [options] - Options.
   * @param {SiteClient} [options.client] - SiteClient used to fetch content.
   */
  constructor(options) {
    options = options || {};
    this.client = options.client || new SiteClient;
  }

  /**
   * Get a list of novels of a user.
   *
   * @param {string} userId - User ID.
   * @return {Promise.<KakuyomuUserNews[]>}
   */
  listNewsOfUser(userId) {
    return this.client.fetch(KakuyomuURL.getUserNewsURL(userId))
      .then(scrape).then($ => this._parsePage($));
  }

  _parsePage($) {
    return _.map($("#usersNews > ul > li"), (item) => {
      const $item = $(item);
      const news = {};

      news.url = KakuyomuURL.resolve($item.children("a").attr("href"));
      news.id = news.url.match(/\/news\/(\d+)/)[1];
      news.title = $.text($item.find(".usersNews-entryTitleLabel"));
      news.commentCount = $.number($item.find(".usersNews-entryComments"));
      news.createdAt = Date.parse($item.find(".usersNews-entryDate > time").attr("datetime"));
      return news;
    });
  }
}
