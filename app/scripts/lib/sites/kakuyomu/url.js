import url from "url";
import _ from "lodash";

/**
 * Kakuyomu URL utility
 */
export default class KakuyomuURL {
  static base = "https://kakuyomu.jp";

  static resolve(path) {
    return url.resolve(this.base, path);
  }

  static isLoginFormURL(testURL) {
    return _.startsWith(testURL, this.getLoginFormURL());
  }
  static isLoginRequiredURL(testURL) {
    return _.startsWith(testURL, this.getMyTopURL()) ||
      _.startsWith(testURL, this.getSettingsURL());
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
  static getSettingsURL() {
    return `${this.base}/settings`;
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
  static getNovelFollowersURL(novelId) {
    const encodedId = encodeURIComponent(novelId);
    return `${this.base}/works/${encodedId}/followers`;
  }
  static getUserNovelsURL(userId) {
    const encodedId = encodeURIComponent(userId);
    return `${this.base}/users/${encodedId}/works`;
  }
  static getUserNewsURL(userId) {
    const encodedId = encodeURIComponent(userId);
    return `${this.base}/users/${encodedId}/news`;
  }
}
