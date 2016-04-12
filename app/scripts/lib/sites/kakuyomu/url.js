import url from "url";

const BASE_URL = "https://kakuyomu.jp";

/**
 * Kakuyomu URL utility
 */
export default class KakuyomuURL {
  static get base() {
    return BASE_URL;
  }

  static resolve(path) {
    return url.resolve(this.base, path);
  }

  static getBaseURL() {
    return this.base;
  }
  static getTopURL() {
    return `${this.base}/`;
  }
  static getMyTopURL() {
    return `${this.base}/my`;
  }
  static getLoginFormURL() {
    return `${this.base}/login`;
  }

  static getNewEpisodeFormURL(novelId) {
    const encodedId = encodeURIComponent(novelId);
    return `${this.base}/my/works/${encodedId}/episodes/new`;
  }

  static getNovelURL(novelId) {
    const encodedId = encodeURIComponent(novelId);
    return `${this.base}/works/${encodedId}`;
  }
  static getNovelReviewsURL(novelId) {
    const encodedId = encodeURIComponent(novelId);
    return `${this.base}/works/${encodedId}/reviews`;
  }
  static getUserNovelsURL(userId) {
    const encodedId = encodeURIComponent(userId);
    return `${this.base}/users/${encodedId}/works`;
  }
}
