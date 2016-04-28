import _ from "lodash";
import scrape from "../../../util/scrape";
import SiteClient from "../../site-client";
import KakuyomuURL from "../url";

/**
 * @typedef {Object} KakuyomuMyNewsComment
 * @property {string}  id - ID of the comment.
 * @property {string}  url - URL of the comment.
 * @property {string}  body - Short body of the comment.
 * @property {string}  articleTitle - Title of the article where the comment is written.
 * @property {string}  articleUrl - URL of the article where the comment is written.
 * @property {string}  userName - Name of the user who wrote the comment.
 * @property {string}  userUrl - URL of the user who wrote the comment.
 */

/**
 * Listing received comments in author's news (Kinkyou Note) in Kakuyomu.
 */
export default class KakuyomuMyNewsCommentLister {
  /**
   * @param {Object} [options] - Options.
   * @param {SiteClient} [options.client] - SiteClient used to fetch content.
   */
  constructor(options) {
    options = options || {};
    this.client = options.client || new SiteClient;
  }

  /**
   * @return {Promise.<KakuyomuMyNewsComment[]>}
   */
  listReceivedComments() {
    return this.client.fetch(KakuyomuURL.getMyTopURL())
      .then(scrape).then($ => this._parsePage($));
  }

  _parsePage($) {
    const resolve = (path) => (path ? KakuyomuURL.resolve(path) : null);
    return _.map($("#news-commentsList > li"), (item) => {
      const $item = $(item);
      const comment = {};
      comment.url = resolve($item.find(".news-commentsList-date").attr("href"));
      comment.id = comment.url && comment.url.match(/#comment-(\d+)/)[1];

      $item.find(".news-commentsList-readMore").remove();
      comment.body = $.text($item.find(".news-commentsList-commentBody"));

      const article = $item.find(".news-commentsList-commentedNewsEntryTitle a");
      comment.articleTitle = $.text(article);
      comment.articleUrl = resolve(article.attr("href"));

      const author = $item.find(".news-commentsList-author");
      comment.userName = $.text(author);
      comment.userUrl = resolve(author.attr("href"));

      return comment;
    });
  }
}
