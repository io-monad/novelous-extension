import scrape from "../../util/scrape";
import narouMeta from "./meta.json";

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
   * @param {string} [mypageBaseUrl] - A base URL for mypages of Narou.
   */
  constructor(mypageBaseUrl) {
    this.mypageBaseUrl = mypageBaseUrl || narouMeta.mypageBaseUrl;
  }

  /**
   * @param {string} userId - User ID.
   * @param {number} [page=1] - Page number to get.
   * @return {Promise} A promise that resolves to a list of novels.
   */
  listNovelsOfUser(userId, page = 1) {
    return new Promise((resolve, reject) => {
      scrape.fetch(this.getURL(userId, page))
      .then($ => { resolve(this._parsePage($)); })
      .catch(reject);
    });
  }

  getURL(userId, page) {
    const encodedId = encodeURIComponent(userId);
    let url = `${this.mypageBaseUrl}/mypage/novellist/userid/${encodedId}/`;
    if (page > 1) {
      const encodedPage = encodeURIComponent(page);
      url += `index.php?all=1&all2=1&all3=1&all4=1&p=${encodedPage}`;
    }
    return url;
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
