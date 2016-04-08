import scrape from "../../util/scrape";
import narouMeta from "./meta.json";

/**
 * @typedef {Object} NarouMyBlogComment
 * @property {string}  id - ID of the comment.
 * @property {string}  body - Body of the comment.
 * @property {string}  articleTitle - Title of the article where the comment is written.
 * @property {string}  articleUrl - URL of the article where the comment is written.
 * @property {?string} userName - Name of the user who wrote the comment.
 * @property {?string} userUrl - URL of the user who wrote the comment.
 * @property {number}  createdAt - Timestamp when the comment was written.
 */

/**
 * Listing received comments in author's blog in Narou.
 */
export default class NarouMyBlogCommentLister {
  /**
   * @param {Object} [options] - Options.
   * @param {string} [options.baseUrl] - A base URL of Narou.
   */
  constructor(options) {
    options = _.extend({}, narouMeta, options);
    this.baseUrl = options.baseUrl;
  }

  /**
   * @return {Promise.<NarouMyBlogComment[]>}
   */
  listReceivedComments() {
    return scrape.fetch(this.getURL()).then($ => this._parsePage($));
  }

  getURL() {
    return `${this.baseUrl}/userblog/passivelist/`;
  }

  _parsePage($) {
    return _.map($(".blogcomment_list"), (item) => {
      const $item = $(item);
      const comment = {};
      comment.body = $.text($item.find(".comment_bun"));
      comment.articleTitle = $.text($item.find(".blog_title"));
      comment.articleUrl = $item.find(".blog_title > a").attr("href");

      const $userLink = $item.find(".blogcomment_info").first().find("a");
      if ($userLink.length === 0) {
        const info = $.text($item.find(".blogcomment_info"));
        const matched = info.match(/投稿者：[\n ]*(.+?) *\n/);
        comment.userName = matched ? matched[1] : null;
        comment.userUrl = null;
      } else {
        comment.userName = $.text($userLink);
        comment.userUrl = $userLink.attr("href");
      }

      const deleteUrl = $item.find("a.delete").attr("href");
      if (deleteUrl) {
        comment.id = deleteUrl.match(/blogcomno\/([^\/]+)/)[1];
      }

      comment.createdAt = $.localTime($item.find(".blogcomment_info > span"));
      return comment;
    });
  }
}
