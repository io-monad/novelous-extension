import url from "url";
import _ from "lodash";

/**
 * Narou URL utility
 */
export default class NarouURL {
  static base = "http://syosetu.com";
  static sslBase = "https://ssl.syosetu.com";
  static apiBase = "http://api.syosetu.com";
  static ncodeBase = "http://ncode.syosetu.com";
  static mypageBase = "http://mypage.syosetu.com";

  static resolve(path) {
    return url.resolve(this.base, path);
  }

  static isLoginFormURL(testURL) {
    return _.startsWith(testURL, this.getLoginFormURL());
  }
  static isLoginRequiredURL(testURL) {
    return _.startsWith(testURL, this.getBaseURL()) && testURL !== this.getTopURL();
  }

  static getBaseURL() {
    return this.base;
  }
  static getTopURL() {
    return `${this.base}/`;
  }
  static getLoginFormURL() {
    return `${this.sslBase}/login`;
  }

  static getMyNovelsURL() {
    return `${this.base}/usernovel/list/`;
  }
  static getMyReceivedCommentsURL() {
    return `${this.base}/usernovelimpression/passivelist/`;
  }
  static getMyReceivedReviewsURL() {
    return `${this.base}/usernovelreview/passivelist/`;
  }
  static getMyReceivedMessagesURL() {
    return `${this.base}/messagebox/top/`;
  }
  static getMyReceivedBlogCommentsURL() {
    return `${this.base}/userblog/passivelist/`;
  }

  static getNewEpisodeFormURL(manageNovelId) {
    const encodedId = encodeURIComponent(manageNovelId);
    return `${this.base}/usernovelmanage/ziwainput/ncode/${encodedId}/`;
  }

  static getNovelURL(novelId) {
    const encodedId = encodeURIComponent(novelId.toLowerCase());
    return `${this.ncodeBase}/${encodedId}/`;
  }
  static getNovelInfoURL(novelId) {
    const encodedId = encodeURIComponent(novelId.toLowerCase());
    return `${this.ncodeBase}/novelview/infotop/ncode/${encodedId}/`;
  }
  static getNovelCommentsURL(novelId) {
    const encodedId = encodeURIComponent(novelId.toLowerCase());
    return `${this.ncodeBase}/impression/list/ncode/${encodedId}/`;
  }
  static getNovelReviewsURL(novelId) {
    const encodedId = encodeURIComponent(novelId.toLowerCase());
    return `${this.ncodeBase}/novelreview/list/ncode/${encodedId}/`;
  }

  static getUserTopURL(userId) {
    const encodedId = encodeURIComponent(userId);
    return `${this.mypageBase}/${encodedId}/`;
  }
  static getUserNovelsURL(userId, page = 1) {
    const encodedId = encodeURIComponent(userId);
    let resultURL = `${this.mypageBase}/mypage/novellist/userid/${encodedId}/`;
    if (page && page > 1) {
      const encodedPage = encodeURIComponent(page);
      resultURL += `index.php?all=1&all2=1&all3=1&all4=1&p=${encodedPage}`;
    }
    return resultURL;
  }

  static getNovelAPIURL() {
    return `${this.apiBase}/novelapi/api/`;
  }
}
