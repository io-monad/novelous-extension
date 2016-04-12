import _ from "lodash";
import scrape from "../../../util/scrape";
import SiteClient from "../../site-client";
import NarouURL from "../url";

/**
 * Listing novels of a user in Narou.
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
 *     description: string,
 *     keywords: string[],
 *     genre?: string,
 *     isShortStory: boolean,
 *     isFinished: boolean,
 *     characterCount: number,
 *     episodeCount: number
 *   }>
 * }
 * ```
 */
export default class NarouUserNovelLister {
  /**
   * @param {Object} [options] - Options.
   * @param {SiteClient} [options.client] - SiteClient used to fetch content.
   */
  constructor(options) {
    options = options || {};
    this.client = options.client || new SiteClient;
  }

  /**
   * @param {string} userId - User ID.
   * @param {number} [page=1] - Page number to get.
   * @return {Promise} A promise that resolves to a list of novels.
   */
  listNovelsOfUser(userId, page = 1) {
    return this.client.fetch(NarouURL.getUserNovelsURL(userId, page))
      .then(scrape).then($ => this._parsePage($));
  }

  _parsePage($) {
    const novelCount = $.number($(".allcount"));
    const pageCount = $.number($(".pager_kazu").first(), /([\d,]+ページ中)/) || 1;
    const currentPage = $.number($(".pager_kazu").first(), /([\d,]+)ページ目/) || 1;
    const hasNextPage = currentPage < pageCount;

    const novels = _.map($("#novellist > ul"), (ul) => {
      const $ul = $(ul);
      const novel = {};

      novel.title = $.text($ul.find(".title"));
      novel.url = $ul.find(".title > a").attr("href");
      novel.description = $.text($ul.find(".ex"));
      novel.genre = $.text($ul.find(".genre")) || null;

      const novelType = $.text($ul.find(".type"));
      if (novelType === "短編") {
        novel.isShortStory = true;
        novel.isFinished = true;
        novel.episodeCount = 1;
      } else {
        novel.isShortStory = false;
        novel.isFinished = novelType === "完結済：";
        novel.episodeCount = $.number($ul.find(".date1"), /全([\d,]+)部/);
      }

      novel.keywords = $.keywords($ul.find(".keikokutag"))
        .concat($.keywords($ul.find(".keyword")));
      novel.characterCount = $.number($ul.find(".date"), /([\d,]+)文字/);

      return novel;
    });

    return { novelCount, pageCount, currentPage, hasNextPage, novels };
  }
}
