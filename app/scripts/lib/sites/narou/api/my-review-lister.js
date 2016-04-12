import _ from "lodash";
import scrape from "../../../util/scrape";
import SiteClient from "../../site-client";
import NarouURL from "../url";

/**
 * @typedef {Object} NarouMyReview
 * @property {string}  id - ID of the review.
 * @property {string}  title - Title of the review.
 * @property {string}  body - Body of the review.
 * @property {string}  novelTitle - Title of the reviewed novel.
 * @property {string}  novelUrl - URL of the reviewed novel.
 * @property {string}  userName - Name of the user who wrote the review.
 * @property {string}  userUrl - URL of the user who wrote the review.
 * @property {number}  createdAt - Timestamp when the review was written.
 */

/**
 * Listing received reviews in Narou.
 */
export default class NarouMyReviewLister {
  /**
   * @param {Object} [options] - Options.
   * @param {SiteClient} [options.client] - SiteClient used to fetch content.
   */
  constructor(options) {
    options = options || {};
    this.client = options.client || new SiteClient;
  }

  /**
   * @return {Promise.<NarouMyReview[]>}
   */
  listReceivedReviews() {
    return this.client.fetch(NarouURL.getMyReceivedReviewsURL())
      .then(scrape).then($ => this._parsePage($));
  }

  _parsePage($) {
    return _.map($(".novelcomment_list"), (item) => {
      const $item = $(item);
      const review = {};
      const deleteUrl = $item.find(".novelcomment_info > a.delete").attr("href");
      review.id = deleteUrl.match(/reviewid\/([^\/]+)/)[1];
      review.title = $.text($item.find(".review_title"));
      review.body = $.text($item.find(".novelcomment"));
      review.novelTitle = $.text($item.find(".novelmain_info"));
      review.novelUrl = $item.find(".novelmain_info > a").attr("href");
      review.userName = $.text($item.find(".novelcomment_info > a").first());
      review.userUrl = $item.find(".novelcomment_info > a").first().attr("href");
      review.createdAt = $.localTime($item.find(".novelcomment_info > span"));
      return review;
    });
  }
}
