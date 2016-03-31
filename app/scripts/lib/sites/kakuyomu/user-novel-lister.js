import kakuyomuMeta from "./meta.json";
import scrape from "../../util/scrape";
import url from "url";

/**
 * Listing novels of a user in Kakuyomu.
 *
 * List definition:
 * ```
 * {
 *   novelCount: number,
 *   pageCount: number,
 *   currentPage: number,
 *   hasNextPage: boolean,
 *   novels: Array.<{
 *     url: string,
 *     title: string,
 *     color: string,
 *     description: string,
 *     keywords: string[],
 *     genre?: string,
 *     isOriginal: boolean,
 *     originalTitle?: string,
 *     isFinished: boolean,
 *     characterCount: number,
 *     episodeCount: number,
 *     starCount: number,
 *     updatedAt: number
 *   }>
 * }
 * ```
 */
export default class KakuyomuUserNovelLister {
  /**
   * @param {string} [baseUrl] - A base URL of Kakuyomu.
   */
  constructor(baseUrl) {
    this.baseUrl = baseUrl || kakuyomuMeta.baseUrl;
  }

  /**
   * Get a list of novels of a user.
   *
   * @param {string} userId - User ID.
   * @param {number} [page=1] - Page number to get.
   * @return {Promise} A promise that resolves to a list of novels.
   */
  listNovelsOfUser(userId, page = 1) {
    return new Promise((resolve, reject) => {
      scrape.fetch(this._getURL(userId, page))
      .then($ => { resolve(this._parsePage($)); })
      .catch(reject);
    });
  }

  _getURL(userId, page) {  // eslint-disable-line
    const encodedId = encodeURIComponent(userId);
    // page is not implemented yet!
    return `${this.baseUrl}/users/${encodedId}/works`;
  }

  _parsePage($) {
    const novelCount = $.number($("#user-nav li.active .widget-user-navCount"));
    const pageCount = 1;
    const currentPage = 1;
    const hasNextPage = currentPage < pageCount;

    const novels = _.map($("#works > [itemscope]"), (item) => {
      const $item = $(item);
      const novel = {};
      const resolve = (path) => url.resolve(this.baseUrl, path);

      novel.color = $item.find(".widget-workCard-workColor").css("background-color");
      novel.title = $.text($item.find(".widget-workCard-titleLabel"));
      novel.url = resolve($item.find(".widget-workCard-titleLabel").attr("href"));
      novel.description = $.text($item.find(".widget-workCard-introduction"));
      novel.starCount = $.number($item.find(".widget-workCard-reviewPoints"));

      const genre = $.text($item.find(".widget-workCard-genre"));
      if (/^二次創作：/.test(genre)) {
        novel.isOriginal = false;
        novel.genre = null;
        novel.originalTitle = genre.replace(/^二次創作：/, "");
      } else {
        novel.isOriginal = true;
        novel.genre = genre;
        novel.originalTitle = null;
      }

      novel.isFinished = ($.text($item.find(".widget-workCard-statusLabel")) === "完結済");
      novel.episodeCount = $.number($item.find(".widget-workCard-episodeCount"));
      novel.characterCount = $.number($item.find(".widget-workCard-characterCount"));
      novel.updatedAt = $.localTime($item.find(".widget-workCard-dateUpdated"));

      novel.keywords = _.map(
        $item.find(".widget-workCard-summary [itemprop=keywords]"),
        el => $.text(el)
      );

      return novel;
    });

    return { novelCount, pageCount, currentPage, hasNextPage, novels };
  }
}
