import url from "url";
import _ from "lodash";
import scrape from "../../util/scrape";
import kakuyomuMeta from "./meta.json";

/**
 * Listing reviews on a novel in Kakuyomu.
 */
export default class KakuyomuReviewLister {
  /**
   * @param {Object}  [options] - Options.
   * @param {string}  [options.baseUrl] - A base URL of Kakuyomu.
   */
  constructor(options) {
    options = options || {};
    this.baseUrl = options.baseUrl || kakuyomuMeta.baseUrl;
  }

  /**
   * @param {string} novelId
   * @return {Promise.<Array<KakuyomuReview>}
   */
  listReviews(novelId) {
    return scrape.fetch(this.getURL(novelId)).then($ => this._parsePage($));
  }

  getURL(novelId) {
    const encodedId = encodeURIComponent(novelId);
    return `${this.baseUrl}/works/${encodedId}/reviews`;
  }

  _parsePage($) {
    const resolve = (path) => (path ? url.resolve(this.baseUrl, path) : null);
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
