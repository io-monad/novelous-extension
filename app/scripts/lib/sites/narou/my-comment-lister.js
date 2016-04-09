import _ from "lodash";
import scrape from "../../util/scrape";
import narouMeta from "./meta.json";
import requestMine from "./request-mine";

/**
 * @typedef {Object} NarouMyComment
 * @property {string}  id - ID of the comment.
 * @property {string}  body - Body of the comment.
 * @property {string}  replyUrl - URL of the reply form to the comment.
 * @property {string}  novelTitle - Title of the commented novel.
 * @property {string}  novelUrl - URL of the commented novel.
 * @property {string}  novelCommentsUrl - URL of comments page of the commented novel.
 * @property {?string} userName - Name of the user who wrote the comment.
 * @property {?string} userUrl - URL of the user who wrote the comment.
 * @property {number}  createdAt - Timestamp when the comment was written.
 */

/**
 * Listing received comments in Narou.
 */
export default class NarouMyCommentLister {
  /**
   * @param {Object} [options] - Options.
   * @param {string} [options.baseUrl] - A base URL of Narou.
   */
  constructor(options) {
    options = _.extend({}, narouMeta, options);
    this.baseUrl = options.baseUrl;
  }

  /**
   * @return {Promise.<NarouMyComment[]>}
   */
  listReceivedComments() {
    return requestMine(this.getURL()).then(scrape).then($ => this._parsePage($));
  }

  getURL() {
    return `${this.baseUrl}/usernovelimpression/passivelist/`;
  }

  _parsePage($) {
    return _.map($(".novelcomment_list"), (item) => {
      const $item = $(item);
      const comment = {};
      comment.body = $.text($item.find(".novelcomment").first());
      comment.replyUrl = $item.find(".novelcomment").last().children("a").attr("href");
      comment.novelTitle = $.text($item.find(".novelmain_info"));
      comment.novelUrl = $item.find(".novelmain_info > a").attr("href");
      comment.novelCommentsUrl = $item.find(".novel_title > a").attr("href");
      comment.id = comment.replyUrl.match(/kanrino\/([^\/]+)/)[1];

      const $link = $item.find(".novelcomment_info > a:not(.delete)");
      if ($link.length === 0) {
        const info = $.text($item.find(".novelcomment_info"));
        const matched = info.match(/投稿者：\n *(.+?) *\n/);
        comment.userName = matched ? matched[1] : null;
        comment.userUrl = null;
      } else {
        comment.userName = $.text($link);
        comment.userUrl = $link.attr("href");
      }

      comment.createdAt = $.localTime($item.find(".novelcomment_info > span"));
      return comment;
    });
  }
}
