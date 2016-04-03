import kakuyomuMeta from "./meta.json";
import KakuyomuNovelFetcher from "./novel-fetcher";
import scrape from "../../util/scrape";
import promises from "../../util/promises";
import url from "url";

/**
 * @typedef {Object} KakuyomuMyNovel
 * @property {string}   id - ID of the novel.
 * @property {string}   title - Title of the novel.
 * @property {string}   url - URL of the novel.
 * @property {string}   authorUserId - User ID of the author of the novel.
 * @property {string}   authorName - Name of the author of the novel.
 * @property {?string}  authorUrl - URL of the author's page.
 * @property {number}   characterCount - Count of characters in the novel.
 * @property {number}   episodeCount - Count of episodes in the novel.
 * @property {?string}  latestEpisodeUrl - URL of the latest episode.
 * @property {boolean}  isFinished - `true` if the novel is marked as finished.
 * @property {number}   reviewCount - Count of reviews on the novel.
 * @property {number}   followerCount - Count of followers on the novel.
 * @property {number}   starCount - Count of stars on the novel.
 * @property {boolean}  isPrivate - `true` if the novel is private.
 * @property {string}   editUrl - URL of the page of editting the novel.
 * @property {string}   newEpisodeUrl - URL of the page of submitting a new episode.
 */

/**
 * @typedef {Object} KakuyomuMyDetailedNovel
 * @extends {KakuyomuMyNovel}
 * @property {string}   color - Theme color of the novel in CSS expression.
 * @property {?string}  catchphrase - Catchphrase (tagline) of the novel.
 * @property {string}   description - Description of the novel.
 * @property {string[]} keywords - Keywords of the novel.
 * @property {?string}  genre - Genre of the novel.
 * @property {boolean}  isFunFiction - `true` if the novel is a fun-fiction.
 * @property {?string}  originalTitle - Title of the original work of the novel.
 * @property {number}   createdAt - Timestamp when the first episode was published.
 * @property {number}   updatedAt - Timestamp when the latest episode was published.
 * @property {KakuyomuReview[]} reviews - Recent reviews on the novel.
 */

/**
 * Listing my own novels in Kakuyomu.
 */
export default class KakuyomuMyNovelLister {
  /**
   * @param {Object}  [options] - Options.
   * @param {string}  [options.baseUrl] - A base URL of Kakuyomu.
   * @param {boolean} [options.fetchDetails] - `true` if fetching details from server.
   * @param {number}  [options.fetchInterval] - Interval between fetches from server.
   * @param {KakuyomuNovelFetcher} [options.novelFetcher]
   */
  constructor(options) {
    options = _.extend({
      baseUrl: kakuyomuMeta.baseUrl,
      fetchDetails: false,
      fetchInterval: 1000,
    }, options);
    this.baseUrl = options.baseUrl;
    this.fetchDetails = options.fetchDetails;
    this.fetchInterval = options.fetchInterval;
    this.novelFetcher = options.novelFetcher || new KakuyomuNovelFetcher(options);
  }

  /**
   * @return {Promise.<Array<KakuyomuMyNovel|KakuyomuMyDetailedNovel>}
   *     If `fetchDetails` is set to `true`, returns a Promise of an array of
   *     `KakuyomuMyDetailedNovel` for public novels and
   *     `KakuyomuMyNovel` for private novels.
   *     It fetches details for each novel from Kakuyomu server.
   *
   *     If `fetchDetails` is set to `false`, returns a Promise of an array of
   *     `KakuyomuMyNovel` only. It never fetches details from the server.
   */
  listNovels() {
    return new Promise((resolve, reject) => {
      scrape.fetch(this._getURL())
      .then($ => {
        const novels = this._parsePage($);
        if (this.fetchDetails) {
          this._decorateNovels(novels).then(resolve, reject);
        } else {
          resolve(novels);
        }
      })
      .catch(reject);
    });
  }

  _getURL() {
    return `${this.baseUrl}/my`;
  }

  _parsePage($) {
    const resolve = (path) => (path ? url.resolve(this.baseUrl, path) : null);
    const authorName = $.text($("#profile > h2:first"));
    const authorUrl = resolve($("#profile > h2:first > a").attr("href"));
    const authorUserId = authorUrl.match(/\/users\/([^\/]+)/)[1];

    return _.map($("#works-hasWorks > ul > li"), (item) => {
      const $item = $(item);
      const novel = { authorName, authorUrl, authorUserId };

      novel.editUrl = resolve($item.find("h3 > a:last").attr("href"));
      novel.id = novel.editUrl.match(/\/works\/(\d+)/)[1];
      novel.newEpisodeUrl = `${novel.editUrl}/episodes/new`;

      const status = $item.find("span[class*='label-workStatus-']:first")
        .prop("className").replace(/^.*label-workStatus-(\w+).*$/, "$1");
      novel.isFinished = status === "isCompleted";
      novel.isPrivate = status === "isUnpublished" || status === "isHidden";

      $item.find(".widget-myWork-edit").remove();
      novel.title = $.text($item.find(".widget-myWork-title"));
      novel.url = `${this.baseUrl}/works/${novel.id}`;
      novel.episodeCount = $.number($item.find(".works-workStatus"), /([\d,]+)話/);

      const $meta = $item.find(".widget-myWork-meta");
      novel.characterCount = $.number($meta, /([\d,]+)文字/);
      novel.starCount = $.number($meta, /★([\d,]+)/);
      novel.followerCount = $.number($meta, /([\d,]+)人のフォロワー/);

      const reviewTooltip = $meta.find("[data-ui-tooltip-label$='の評価']").data("uiTooltipLabel");
      novel.reviewCount = $.number(reviewTooltip);

      novel.latestEpisodeUrl =
        resolve($item.find(".works-workEpisodes-labelTitle:last").attr("href"));

      return novel;
    });
  }

  _decorateNovels(novels) {
    return promises.map(novels, { interval: this.fetchInterval }, (novel) => {
      if (novel.isPrivate) {
        return novel;
      }
      return this.novelFetcher.fetchNovel(novel.id)
        .then((details) => _.extend(novel, details));
    });
  }
}
