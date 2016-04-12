import url from "url";
import _ from "lodash";
import scrape from "../../util/scrape";
import SiteClient from "../site-client";
import kakuyomuMeta from "./meta.json";

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
 * Listing my own novels in Kakuyomu.
 */
export default class KakuyomuMyNovelLister {
  /**
   * @param {Object} [options] - Options.
   * @param {string} [options.baseUrl] - A base URL of Kakuyomu.
   * @param {SiteClient} [options.client] - SiteClient used to fetch content.
   */
  constructor(options) {
    options = options || {};
    this.baseUrl = options.baseUrl || kakuyomuMeta.baseUrl;
    this.client = options.client || new SiteClient;
  }

  /**
   * Get IDs of my own novels.
   *
   * @return {Promise.<Array<string>} Novel IDs.
   */
  listNovelIds() {
    return this.client.fetch(this.getURL())
      .then(scrape).then($ => this._parseIdList($));
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
    return this.client.fetch(this.getURL())
      .then(scrape).then($ => this._parseNovelList($));
  }

  getURL() {
    return `${this.baseUrl}/my`;
  }

  _parseIdList($) {
    return _.map($("#works-hasWorks > ul > li"), (item) => {
      const $item = $(item);
      const editUrl = $item.find("h3 > a").last().attr("href");
      return editUrl.match(/\/works\/(\d+)/)[1];
    });
  }

  _parseNovelList($) {
    const resolve = (path) => (path ? url.resolve(this.baseUrl, path) : null);
    const authorName = $.text($("#profile > h2").first());
    const authorUrl = resolve($("#profile > h2").first().children("a").attr("href"));
    const authorUserId = authorUrl.match(/\/users\/([^\/]+)/)[1];

    return _.map($("#works-hasWorks > ul > li"), (item) => {
      const $item = $(item);
      const novel = { authorName, authorUrl, authorUserId };

      novel.editUrl = resolve($item.find("h3 > a").last().attr("href"));
      novel.id = novel.editUrl.match(/\/works\/(\d+)/)[1];
      novel.newEpisodeUrl = `${novel.editUrl}/episodes/new`;

      const status = $item.find("span[class*='label-workStatus-']").first()
        .attr("class").replace(/^.*label-workStatus-(\w+).*$/, "$1");
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
        resolve($item.find(".works-workEpisodes-labelTitle").last().attr("href"));

      return novel;
    });
  }
}
