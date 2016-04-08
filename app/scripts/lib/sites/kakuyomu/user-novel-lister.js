import url from "url";
import colorString from "color-string";
import scrape from "../../util/scrape";
import kakuyomuMeta from "./meta.json";

/**
 * @typedef {Object} KakuyomuUserNovel
 * @property {string}   id - ID of the novel.
 * @property {string}   title - Title of the novel.
 * @property {string}   url - URL of the novel.
 * @property {string}   description - Description of the novel.
 * @property {string}   authorUserId - User ID of the author of the novel.
 * @property {string}   authorName - Name of the author of the novel.
 * @property {?string}  authorUrl - URL of the author's page.
 * @property {string[]} keywords - Keywords of the novel.
 * @property {?string}  genre - Genre of the novel.
 * @property {number}   characterCount - Count of characters in the novel.
 * @property {number}   episodeCount - Count of episodes in the novel.
 * @property {boolean}  isFinished - `true` if the novel is marked as finished.
 * @property {boolean}  isFunFiction - `true` if the novel is a fun-fiction.
 * @property {?string}  originalTitle - Title of the original work of the novel.
 * @property {number}   starCount - Count of stars on the novel.
 * @property {number}   updatedAt - Timestamp when the latest episode was published.
 */

/**
 * Listing novels of a user in Kakuyomu.
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
   * @return {Promise.<KakuyomuUserNovel[]>}
   */
  listNovelsOfUser(userId) {
    return scrape.fetch(this.getURL(userId)).then($ => this._parsePage($));
  }

  getURL(userId) {
    const encodedId = encodeURIComponent(userId);
    return `${this.baseUrl}/users/${encodedId}/works`;
  }

  _parsePage($) {
    return _.map($("#works > [itemscope]"), (item) => {
      const $item = $(item);
      const novel = {};
      const resolve = (path) => url.resolve(this.baseUrl, path);
      const $props = $item.find("[itemprop]:not([itemscope] [itemscope] *)");

      const colorValue = $item.find(".widget-workCard-workColor").css("background-color");
      novel.color = colorString.to.rgb(colorString.get.rgb(colorValue));
      novel.title = $.text($props.filter("[itemprop=name]"));
      novel.url = resolve($props.filter("[itemprop=name]").attr("href"));
      novel.id = novel.url.match(/\/works\/(\d+)/)[1];
      novel.authorName = $.text($props.filter("[itemprop=author]"));
      novel.authorUrl = resolve($props.filter("[itemprop=author]").attr("href"));
      novel.authorUserId = novel.authorUrl.match(/\/users\/([^/]+)/)[1];
      novel.description = $.text($item.find(".widget-workCard-introduction"));
      novel.starCount = $.number($item.find(".widget-workCard-reviewPoints"));

      const genre = $.text($props.filter("[itemprop=genre]"));
      if (/^二次創作：/.test(genre)) {
        novel.isFunFiction = true;
        novel.genre = null;
        novel.originalTitle = genre.replace(/^二次創作：/, "");
      } else {
        novel.isFunFiction = false;
        novel.genre = genre;
        novel.originalTitle = null;
      }

      novel.isFinished = ($.text($item.find(".widget-workCard-statusLabel")) === "完結済");
      novel.episodeCount = $.number($item.find(".widget-workCard-episodeCount"));
      novel.characterCount = $.number($props.filter("[itemprop=characterCount]"));
      novel.updatedAt = $.localTime($props.filter("[itemprop=dateModified]"));
      novel.keywords = _.map($props.filter("[itemprop=keywords]"), $.text);
      return novel;
    });
  }
}
