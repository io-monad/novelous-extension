import scrape from "../../util/scrape";
import narouMeta from "./meta.json";

/**
 * Fetcher for novel data in Narou.
 *
 * Novel data definition:
 * ```
 * {
 *   url: string,
 *   title: string,
 *   description: string,
 *   authorName: string,
 *   authorUrl?: string,
 *   keywords: string[],
 *   genre?: string,
 *   isShortStory: boolean,
 *   isFinished: boolean,
 *
 *   characterCount: number,
 *   episodeCount: number,
 *   latestEpisodeUrl?: string,
 *
 *   commentCount: number,
 *   reviewCount: number,
 *   bookmarkCount: number,
 *
 *   point: number,
 *   pointForQuality: number,
 *   pointForStory: number,
 *
 *   createdAt: number,
 *   updatedAt: number
 * }
 * ```
 */
export default class NarouNovelFetcher {
  /**
   * @param {string} [ncodeBaseUrl] - A base URL of Narou.
   */
  constructor(ncodeBaseUrl) {
    this.ncodeBaseUrl = ncodeBaseUrl || narouMeta.ncodeBaseUrl;
  }

  /**
   * @param {string} novelId - Novel ID.
   * @return {Promise} A promise that resolves to a novel data Object.
   */
  fetchNovel(novelId) {
    return new Promise((resolve, reject) => {
      scrape.fetch(this.getURL(novelId))
      .then($ => { resolve(this._parsePage($)); })
      .catch(reject);
    });
  }

  getURL(novelId) {
    const encodedId = encodeURIComponent(novelId.toLowerCase());
    return `${this.ncodeBaseUrl}/novelview/infotop/ncode/${encodedId}/`;
  }

  _parsePage($) {
    const novel = {};
    novel.title = $.text($("h1"));
    novel.url = $("h1 > a").attr("href");

    const novelType = $.text($("#noveltype, #noveltype_notend"));
    if (novelType === "短編") {
      novel.isShortStory = true;
      novel.isFinished = true;
      novel.latestEpisodeUrl = novel.url;
      novel.episodeCount = 1;
    } else {
      novel.isShortStory = false;
      novel.isFinished = novelType === "完結済";
      novel.latestEpisodeUrl = $("#pre_info a").last().attr("href") || null;
      novel.episodeCount = $.number($("#pre_info"), /全([\d,]+)部/);
    }

    const ths = $("#noveltable1 tr > th, #noveltable2 tr > th");
    const tds = $("#noveltable1 tr > td, #noveltable2 tr > td");
    const data = _.zipObject(
      _.map(ths, th => $.text(th)),
      _.map(tds, td => ({ text: $.text(td), el: td }))
    );

    novel.description = data["あらすじ"].text;
    novel.authorName = data["作者名"].text;
    novel.authorUrl = $(data["作者名"].el).find("a").attr("href") || null;
    novel.keywords = $.keywords(data["キーワード"].text);
    novel.genre = data["ジャンル"].text || null;
    novel.createdAt = $.localTime(data["掲載日"].text);
    novel.updatedAt = $.localTime(data["最終話掲載日"].text);
    novel.commentCount = $.number(data["感想"].text);
    novel.reviewCount = $.number(data["レビュー"].text);
    novel.bookmarkCount = $.number(data["ブックマーク登録"].text);
    novel.point = $.number(data["総合評価"].text);

    const points = data["ポイント評価"].text.split("：");
    novel.pointForQuality = $.number(points[0]);
    novel.pointForStory = $.number(points[1]);

    novel.characterCount = $.number(data["文字数"].text);
    return novel;
  }
}
