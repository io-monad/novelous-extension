import _ from "lodash";
import scrape from "../../../util/scrape";
import SiteClient from "../../site-client";
import KakuyomuURL from "../url";

/**
 * Listing reviews on a novel in Kakuyomu.
 */
export default class KakuyomuReviewLister {
  /**
   * @param {Object} [options] - Options.
   * @param {SiteClient} [options.client] - SiteClient used to fetch content.
   */
  constructor(options) {
    options = options || {};
    this.client = options.client || new SiteClient;
  }

  /**
   * @param {string} novelId
   * @return {Promise.<KakuyomuReview[]>}
   */
  listReviews(novelId) {
    return this.client.fetch(KakuyomuURL.getNovelReviewsURL(novelId))
      .then(scrape).then($ => this._parsePage($));
  }

  _parsePage($) {
    const resolve = (path) => (path ? KakuyomuURL.resolve(path) : null);
    const $reviews = $("#workReview-list :not(.isOnlyPoints)[itemscope][itemtype$='/Review']");
    return _.map($reviews, (item) => {
      const $props = $(item).find("[itemprop]");
      const review = {};
      review.url = resolve($props.filter("[itemprop=url]").attr("href"));
      review.id = review.url.match(/reviews\/([^\/]+)/)[1];
      review.title = $.text($props.filter("[itemprop=name]"));
      review.rating = $.text($props.filter("[itemprop=reviewRating]").find("span").first());
      review.authorName = $.text($props.filter("[itemprop=author]"));
      review.authorUrl = resolve($props.filter("[itemprop=author]").parents("a").attr("href"));
      review.authorUserId = review.authorUrl.match(/users\/([^\/]+)/)[1];
      review.body = $.text($props.filter("[itemprop=reviewBody]").find("a").remove().end());
      review.createdAt = Date.parse($props.filter("[itemprop=datePublished]").attr("datetime"));
      return review;
    });
  }
}
