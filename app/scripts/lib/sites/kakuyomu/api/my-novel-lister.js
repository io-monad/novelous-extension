import _ from "lodash";
import scrape from "../../../util/scrape";
import SiteClient from "../../site-client";
import KakuyomuURL from "../url";

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
 * @property {number}   rateCount - Count of rates on the novel.
 * @property {number}   followerCount - Count of followers on the novel.
 * @property {number}   starCount - Count of stars on the novel.
 * @property {number}   updatedAt - Timestamp when the latest episode was published.
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
   * @param {SiteClient} [options.client] - SiteClient used to fetch content.
   */
  constructor(options) {
    options = options || {};
    this.client = options.client || new SiteClient;
  }

  /**
   * Get IDs of my own novels.
   *
   * @return {Promise.<string[]>} Novel IDs.
   */
  listNovelIds() {
    return this.client.fetch(KakuyomuURL.getMyTopURL())
      .then(scrape).then($ => this._parseIdList($));
  }

  /**
   * @return {Promise.<KakuyomuMyNovel[]>} List of novels.
   */
  listNovels() {
    return this.client.fetch(KakuyomuURL.getMyTopURL())
      .then(scrape).then($ => this._parseNovelList($));
  }

  _parseIdList($) {
    return _.map($("#works-hasWorks > ul > li.widget-list-child"), (item) => {
      const $item = $(item);
      const editUrl = $item.find("h3 > a").last().attr("href");
      return editUrl.match(/\/works\/(\d+)/)[1];
    });
  }

  _parseNovelList($) {
    const resolve = (path) => (path ? KakuyomuURL.resolve(path) : null);
    const authorName = $.text($("#profile > h2").first());
    const authorUrl = resolve($("#profile > h2").first().children("a").attr("href"));
    const authorUserId = authorUrl.match(/\/users\/([^\/]+)/)[1];

    return _.map($("#works-hasWorks > ul > li.widget-list-child"), (item) => {
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
      novel.url = KakuyomuURL.getNovelURL(novel.id);
      novel.episodeCount = $.number($item.find(".works-workStatus"), /([\d,]+)話/);

      const $meta = $item.find(".widget-myWork-meta");
      novel.characterCount = $.number($meta, /([\d,]+)文字/);
      novel.starCount = $.number($meta, /★([\d,]+)/);
      novel.followerCount = $.number($meta, /([\d,]+)人のフォロワー/);

      const rateTooltip = $meta.find("[data-ui-tooltip-label$='の評価']").data("uiTooltipLabel");
      novel.rateCount = $.number(rateTooltip);

      novel.latestEpisodeUrl =
        resolve($item.find(".works-workEpisodes-labelTitle").last().attr("href"));

      const times = _.map($item.find(".works-workEpisodes-labelDate"), el => $.localTime(el));
      novel.updatedAt = _.max(times) || null;

      return novel;
    });
  }
}
