import _ from "lodash";
import scrape from "../../../util/scrape";
import SiteClient from "../../site-client";
import NarouURL from "../url";
import NarouNovelAPI from "./novel-api";

/**
 * @typedef {Object} NarouMyNovel
 * @extends {NarouNovel}
 * @property {string} manageUrl - URL of the page of managing the novel.
 * @property {string} editUrl - URL of the page of editting the novel.
 * @property {string} manageId - ID of the novel in management system.
 * @property {string} newEpisodeUrl - URL of the page of submitting a new episode.
 */

/**
 * Listing my own novels in Narou.
 */
export default class NarouMyNovelLister {
  /**
   * @param {Object} [options] - Options.
   * @param {SiteClient} [options.client] - SiteClient used to fetch content.
   * @param {NarouNovelAPI} [options.novelAPI]
   *     NarouNovelAPI instance to use for fetching novels.
   */
  constructor(options) {
    options = options || {};
    options.client = options.client || new SiteClient;
    this.client = options.client;
    this.novelAPI = options.novelAPI || new NarouNovelAPI(options);
  }

  /**
   * @return {Promise.<NarouMyNovel[]>}
   */
  listNovels() {
    return this.client.fetch(NarouURL.getMyNovelsURL()).then(scrape).then($ => {
      const novels = this._parsePage($);
      return this._decorateNovelsByAPI(novels);
    });
  }

  _parsePage($) {
    return _.map($("#novellist tr").slice(1), (item) => {
      const $item = $(item);
      const novel = {};
      const resolve = (path) => NarouURL.resolve(path);

      novel.id = $.text($item.find(".ncode")).toLowerCase();
      novel.manageUrl = resolve($item.find(".title > a").attr("href"));
      novel.editUrl = resolve($item.find(".novel_sousa > a").attr("href"));

      const matched = novel.manageUrl.match(/\/top\/ncode\/(\d+)\//);
      if (matched) {
        novel.manageId = matched[1];
        novel.newEpisodeUrl = NarouURL.getNewEpisodeFormURL(novel.manageId);
      }

      return novel;
    });
  }

  _decorateNovelsByAPI(novels) {
    if (novels.length === 0) return Promise.resolve(novels);
    return this.novelAPI.getNovelsByIds(_.map(novels, "id")).then(apiNovels => {
      const apiNovelMap = _.keyBy(apiNovels, "id");
      return _.map(novels, novel => _.defaults(novel, apiNovelMap[novel.id]));
    });
  }
}
