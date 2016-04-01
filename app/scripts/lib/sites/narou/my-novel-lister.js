import narouMeta from "./meta.json";
import NarouNovelAPI from "./novel-api";
import scrape from "../../util/scrape";
import url from "url";

/**
 * @typedef {Object} NarouMyNovel
 * @extends {NarouNovel}
 * @property {string} manageUrl - URL of the page of managing the novel.
 * @property {string} editUrl - URL of the page of editting the novel.
 * @property {string} manageId - ID of the novel in management system.
 */

/**
 * @typedef {Object} NarouMyNovelList
 * @property {number}  itemsCount - Count of items returned by API.
 * @property {number}  pageCount - Count of available pages.
 * @property {number}  currentPage - Number of the current page (1-origin).
 * @property {boolean} hasNextPage - `true` if there is the next page.
 * @property {NarouMyNovel[]} items - Novels returned from Narou.
 */

/**
 * Listing my own novels in Narou.
 */
export default class NarouMyNovelLister {
  /**
   * @param {Object} [options] - Options.
   * @param {string} [options.baseUrl] - A base URL of Narou.
   * @param {string} [options.apiBaseUrl] - A base URL for API of Narou.
   * @param {string} [options.ncodeBaseUrl] - A base URL for N-Code of Narou.
   * @param {string} [options.mypageBaseUrl] - A base URL for mypages of Narou.
   * @param {NarouNovelAPI} [options.api] - NarouNovelAPI instance to use for fetching novels.
   */
  constructor(options) {
    options = _.extend({}, narouMeta, options);
    this.baseUrl = options.baseUrl;
    this.api = options.api || new NarouNovelAPI(options);
  }

  /**
   * @return {Promise.<NarouMyNovelList>}
   */
  listNovels() {
    return new Promise((resolve, reject) => {
      scrape.fetch(this._getURL())
      .then($ => {
        const result = this._parsePage($);
        this._decorateNovelsByAPI(result.items).then((items) => {
          result.items = items;
          resolve(result);
        })
        .catch(reject);
      })
      .catch(reject);
    });
  }

  _getURL() {
    return `${this.baseUrl}/usernovel/list/`;
  }

  _parsePage($) {
    const itemsCount = $.number($("#location .numItems"));
    const pageCount = $.number($("#location .novellist_naviall"), /([\d,]+ページ中)/) || 1;
    const currentPage = $.number($("#location .novellist_naviall"), /([\d,]+)ページ目/) || 1;
    const hasNextPage = currentPage < pageCount;

    const items = _.map($("#novellist tr:not(:first)"), (item) => {
      const $item = $(item);
      const novel = {};
      const resolve = (path) => url.resolve(this.baseUrl, path);

      novel.id = $.text($item.find(".ncode")).toLowerCase();
      novel.manageUrl = resolve($item.find(".title > a").attr("href"));
      novel.editUrl = resolve($item.find(".novel_sousa > a").attr("href"));

      const matched = novel.manageUrl.match(/\/top\/ncode\/(\d+)\//);
      if (matched) {
        novel.manageId = matched[1];
      }

      return novel;
    });

    return { itemsCount, pageCount, currentPage, hasNextPage, items };
  }

  _decorateNovelsByAPI(novels) {
    if (novels.length === 0) return Promise.resolve(novels);
    return new Promise((resolve, reject) => {
      this.api.getNovelsByIds(_.map(novels, "id"))
      .then((apiNovels) => {
        const apiNovelMap = _.keyBy(apiNovels, "id");
        resolve(_.map(novels, novel => _.defaults(novel, apiNovelMap[novel.id])));
      })
      .catch(reject);
    });
  }
}