import narouMeta from "./meta.json";
import querystring from "querystring";

/**
 * @typedef {Object} NarouNovel
 * @property {string}   id - ID (N-code) of the novel.
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
 * @property {?string}  latestEpisodeUrl - URL of the latest episode.
 * @property {boolean}  isShortStory - `true` if the novel is a short story.
 * @property {boolean}  isFinished - `true` if the novel is marked as finished.
 * @property {boolean}  isFunFiction - `true` if the novel is a fun-fiction.
 * @property {?string}  originalTitle - Title of the original work of the novel.
 * @property {number}   reviewCount - Count of reviews on the novel.
 * @property {number}   bookmarkCount - Count of bookmarks on the novel.
 * @property {number}   rateCount - Count of rates on the novel.
 * @property {number}   point - Total point of the novel.
 * @property {number}   createdAt - Timestamp when the first episode was published.
 * @property {number}   updatedAt - Timestamp when the latest episode was published.
 */

/**
 * @typedef {Object} NarouNovelQueryResult
 * @property {number}  itemsCount - Count of items returned by API.
 * @property {number}  itemsPerPage - Count of items per page passed to API.
 * @property {number}  itemsOffset - Offset of items passed to API.
 * @property {NarouNovel[]} items - Items returned by API.
 */

/**
 * Get novel data by Narou Developer API.
 */
export default class NarouNovelAPI {
  /**
   * @param {Object} [options] - Options.
   * @param {string} [options.apiBaseUrl] - A base URL for API of Narou.
   * @param {string} [options.ncodeBaseUrl] - A base URL for N-Code of Narou.
   * @param {string} [options.mypageBaseUrl] - A base URL for mypages of Narou.
   */
  constructor(options) {
    options = _.extend({}, narouMeta, options);
    this.apiBaseUrl = options.apiBaseUrl;
    this.ncodeBaseUrl = options.ncodeBaseUrl;
    this.mypageBaseUrl = options.mypageBaseUrl;
  }

  /**
   * @param {string} novelId - Novel ID.
   * @param {Object} [query] - Additional query.
   * @return {Promise.<?NarouNovel>}
   */
  getNovelById(novelId, query) {
    return this.queryOne(_.extend({ ncode: novelId }, query));
  }

  /**
   * @param {string[]} novelIds - List of novel IDs.
   * @param {Object} [query] - Additional query.
   * @return {Promise.<NarouNovel[]>}
   */
  getNovelsByIds(novelIds, query) {
    return this.queryMany(_.extend({
      ncode: novelIds,
      lim: novelIds.length,
    }, query));
  }

  /**
   * @param {string} userId - User ID.
   * @param {Object} [query] - Additional query.
   * @return {Promise.<NarouNovelQueryResult>}
   */
  getNovelsByUserId(userId, query) {
    return this.query(_.extend({ userid: userId }, query));
  }

  /**
   * @param {Object} query - Query parameters for API call.
   * @return {Promise.<?NarouNovel>}
   */
  queryOne(query) {
    return new Promise((resolve, reject) => {
      this.query(_.extend({ lim: 1 }, query))
      .then((data) => { resolve(data.items[0] || null); })
      .catch(reject);
    });
  }

  /**
   * @param {Object} query - Query parameters for API call.
   * @return {Promise.<NarouNovel[]>}
   */
  queryMany(query) {
    return new Promise((resolve, reject) => {
      this.query(query)
      .then((data) => { resolve(data.items); })
      .catch(reject);
    });
  }

  /**
   * @param {Object} query - Query parameters for API call.
   * @return {Promise.<NarouNovelQueryResult>}
   */
  query(query) {
    return new Promise((resolve, reject) => {
      query = _.extend({ out: "json" }, query);
      $.getJSON(this._getURL(query))
      .done(response => {
        resolve(this._parseResponse(response, query));
      })
      .fail((xhr, status, error) => {
        reject(error || status);
      });
    });
  }

  /**
   * @private
   */
  _getURL(query) {
    const qs = querystring.stringify(_.mapValues(query || {}, value => {
      if (_.isArray(value)) {
        // Narou API uses "-" for separator of multiple values
        return value.join("-");
      }
      return value;
    }));
    return `${this.apiBaseUrl}/novelapi/api/?${qs}`;
  }

  /**
   * @private
   */
  _parseResponse(response, query) {
    const matchInfo = response.shift();
    const itemsCount = matchInfo.allcount;
    const itemsPerPage = query.lim || 20;
    const itemsOffset = (query.st || 1) - 1;

    const items = _.map(response, raw => {
      const novel = {};
      novel.id = raw.ncode.toLowerCase();
      novel.title = raw.title;
      novel.url = `${this.ncodeBaseUrl}/${novel.id}/`;
      novel.authorUserId = String(raw.userid);
      novel.authorName = raw.writer;
      novel.authorUrl = `${this.mypageBaseUrl}/${novel.authorUserId}/`;
      novel.description = raw.story;
      novel.genre = narouMeta.genres[raw.genre - 1] || null;
      novel.originalTitle = raw.gensaku || null;
      novel.isOriginal = (novel.originalTitle === null);
      novel.keywords = raw.keyword.split(" ");
      novel.createdAt = Date.parse(`${raw.general_firstup} +0900`);
      novel.updatedAt = Date.parse(`${raw.general_lastup} +0900`);
      novel.isFinished = (raw.end === 0);
      novel.episodeCount = raw.general_all_no;
      novel.characterCount = raw.length;
      novel.bookmarkCount = raw.fav_novel_cnt;
      novel.reviewCount = raw.review_cnt;
      novel.rateCount = raw.all_hyoka_cnt;
      novel.ratePoint = raw.all_point;
      novel.point = raw.global_point;

      if (raw.novel_type === 1) {
        novel.isShortStory = false;
        if (novel.episodeCount > 0) {
          novel.latestEpisodeUrl = `${novel.url}${novel.episodeCount}/`;
        } else {
          novel.latestEpisodeUrl = null;
        }
      } else {
        novel.isShortStory = true;
        novel.latestEpisodeUrl = novel.url;
      }

      return novel;
    });

    return {
      itemsCount,
      itemsPerPage,
      itemsOffset,
      items,
    };
  }
}
