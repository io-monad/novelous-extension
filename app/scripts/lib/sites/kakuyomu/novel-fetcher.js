import kakuyomuMeta from "./meta.json";
import url from "url";
import scrape from "../../util/scrape";

/**
 * @typedef {Object} KakuyomuNovel
 * @property {string}   id - ID of the novel.
 * @property {string}   color - Theme color of the novel in CSS expression.
 * @property {string}   title - Title of the novel.
 * @property {string}   url - URL of the novel.
 * @property {?string}  catchphrase - Catchphrase (tagline) of the novel.
 * @property {string}   description - Description of the novel.
 * @property {string}   authorUserId - User ID of the author of the novel.
 * @property {string}   authorName - Name of the author of the novel.
 * @property {?string}  authorUrl - URL of the author's page.
 * @property {string[]} keywords - Keywords of the novel.
 * @property {?string}  genre - Genre of the novel.
 * @property {number}   characterCount - Count of characters in the novel.
 * @property {number}   episodeCount - Count of episodes in the novel.
 * @property {?string}  latestEpisodeUrl - URL of the latest episode.
 * @property {boolean}  isFinished - `true` if the novel is marked as finished.
 * @property {boolean}  isFunFiction - `true` if the novel is a fun-fiction.
 * @property {?string}  originalTitle - Title of the original work of the novel.
 * @property {number}   reviewCount - Count of reviews on the novel.
 * @property {number}   followerCount - Count of followers on the novel.
 * @property {number}   starCount - Count of stars on the novel.
 * @property {number}   createdAt - Timestamp when the first episode was published.
 * @property {number}   updatedAt - Timestamp when the latest episode was published.
 * @property {KakuyomuReview[]} reviews - Recent reviews on the novel.
 */

/**
 * @typedef {Object} KakuyomuReview
 * @property {string}   id - ID of the review.
 * @property {string}   title - Title of the review.
 * @property {string}   url - URL of the review.
 * @property {string}   rating - Rating of the review. A string of stars (★).
 * @property {string}   authorUserId - User ID of the author of the review.
 * @property {string}   authorName - Name of the author of the review.
 * @property {string}   authorUrl - URL of the author's page.
 * @property {string}   body - Body of the review.
 * @property {number}   createdAt - Timestamp when the review was posted.
 */

/**
 * Fetcher for novel data in Kakuyomu.
 */
export default class KakuyomuNovelFetcher {
  /**
   * @param {Object} [options] - Options.
   * @param {string} [options.baseUrl] - A base URL of Kakuyomu.
   */
  constructor(options) {
    options = options || {};
    this.baseUrl = options.baseUrl || kakuyomuMeta.baseUrl;
  }

  /**
   * @param {string} novelId - Novel ID.
   * @return {Promise} A promise that resolves to a novel data Object.
   */
  fetchNovel(novelId) {
    return new Promise((resolve, reject) => {
      scrape.fetch(this._getURL(novelId))
      .then($ => { resolve(this._parsePage($)); })
      .catch(reject);
    });
  }

  _getURL(novelId) {
    const encodedId = encodeURIComponent(novelId.toLowerCase());
    return `${this.baseUrl}/works/${encodedId}`;
  }

  _parsePage($) {
    const novel = {};
    const resolve = (path) => url.resolve(this.baseUrl, path);

    novel.color = $("#workColor").css("background-color");
    novel.title = $.text($("#workTitle"));
    novel.url = resolve($("#workTitle > a").attr("href"));
    novel.id = novel.url.match(/\/works\/(\d+)/)[1];
    novel.authorName = $.text($("#workAuthor-activityName"));
    novel.authorUrl = resolve($("#workAuthor-activityName > a").attr("href"));
    novel.authorUserId = novel.authorUrl.match(/\/users\/([^/]+)/)[1];
    novel.starCount = $.number($("#workPoints"));
    novel.catchphrase = $.text($("#catchphrase-body")) || null;

    $("#introduction").find(".ui-truncateText-expandButton").remove();
    novel.description = $.text($("#introduction"));

    novel.latestEpisodeUrl = resolve(
      $("#table-of-contents .widget-toc-episode:last a").attr("href"));

    const dts = $("#information dl.widget-credit > dt");
    const dds = $("#information dl.widget-credit > dd");
    const data = _.zipObject(_.map(dts, $.text), _.map(dds, $.text));

    novel.isFinished = data["執筆状況"] === "完結済";
    novel.isFunFiction = data["種類"] !== "オリジナル小説";
    novel.originalTitle = data["二次創作原作"] || null;
    novel.episodeCount = $.number(data["エピソード"]);
    novel.genre = data["ジャンル"] || null;
    novel.keywords = $.keywords(data["セルフレイティング"]).concat($.keywords(data["タグ"]));
    novel.characterCount = $.number(data["総文字数"]);
    novel.createdAt = $.localTime(data["公開日"]);
    novel.updatedAt = $.localTime(data["最終更新日"]);
    novel.reviewCount = $.number(data["おすすめレビュー"]);
    novel.followerCount = $.number(data["小説フォロー数"]);

    novel.reviews = _.map($("#reviews [itemscope][itemtype$='/Review']"), (item) => {
      const $props = $(item).find("[itemprop]");
      const review = {};
      review.url = resolve($props.filter("[itemprop=url]").attr("href"));
      review.id = review.url.match(/reviews\/([^\/]+)/)[1];
      review.title = $.text($props.filter("[itemprop=name]"));
      review.rating = $.text($props.filter("[itemprop=reviewRating]").find("span:first"));
      review.authorName = $.text($props.filter("[itemprop=author]"));
      review.authorUrl = resolve($props.filter("[itemprop=author]").parents("a").attr("href"));
      review.authorUserId = review.authorUrl.match(/users\/([^\/]+)/)[1];
      review.body = $.text($props.filter("[itemprop=reviewBody]").find("a").remove().end());
      review.createdAt = Date.parse($props.filter("[itemprop=datePublished]").attr("datetime"));
      return review;
    });

    return novel;
  }
}
