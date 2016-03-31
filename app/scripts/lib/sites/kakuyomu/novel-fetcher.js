import kakuyomuMeta from "./meta.json";
import url from "url";
import scrape from "../../util/scrape";

/**
 * Fetcher for novel data in Kakuyomu.
 *
 * Novel data definition:
 * ```
 * {
 *   url: string,
 *   title: string,
 *   color: string,
 *   catchphrase?: string,
 *   description: string,
 *   authorName: string,
 *   authorUrl: string,
 *   keywords: string[],
 *   genre?: string,
 *   isOriginal: boolean,
 *   originalTitle?: string,
 *   isFinished: boolean,
 *
 *   characterCount: number,
 *   episodeCount: number,
 *   latestEpisodeUrl?: string,
 *
 *   starCount: number,
 *   reviewCount: number,
 *   followerCount: number,
 *
 *   createdAt: number,
 *   updatedAt: number
 * }
 * ```
 */
export default class KakuyomuNovelFetcher {
  /**
   * @param {string} [baseUrl] - A base URL of Kakuyomu.
   */
  constructor(baseUrl) {
    this.baseUrl = baseUrl || kakuyomuMeta.baseUrl;
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
    novel.authorName = $.text($("#workAuthor-activityName"));
    novel.authorUrl = resolve($("#workAuthor-activityName > a").attr("href"));
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
    novel.isOrignal = data["種類"] === "オリジナル小説";
    novel.episodeCount = $.number(data["エピソード"]);
    novel.genre = data["ジャンル"] || null;
    novel.originalTitle = data["二次創作原作"] || null;
    novel.keywords = $.keywords(data["セルフレイティング"]).concat($.keywords(data["タグ"]));
    novel.characterCount = $.number(data["総文字数"]);
    novel.createdAt = $.localTime(data["公開日"]);
    novel.updatedAt = $.localTime(data["最終更新日"]);
    novel.reviewCount = $.number(data["おすすめレビュー"]);
    novel.followerCount = $.number(data["小説フォロー数"]);

    return novel;
  }
}
