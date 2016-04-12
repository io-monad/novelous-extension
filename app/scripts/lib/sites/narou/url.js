import url from "url";

const BASE_URL = "http://syosetu.com";
const SSL_BASE_URL = "https://ssl.syosetu.com";
const API_BASE_URL = "http://api.syosetu.com";
const NCODE_BASE_URL = "http://ncode.syosetu.com";
const MYPAGE_BASE_URL = "http://mypage.syosetu.com";

/**
 * Narou URL utility
 */
export default class NarouURL {
  static get base() {
    return BASE_URL;
  }
  static get sslBase() {
    return SSL_BASE_URL;
  }
  static get apiBase() {
    return API_BASE_URL;
  }
  static get ncodeBase() {
    return NCODE_BASE_URL;
  }
  static get mypageBase() {
    return MYPAGE_BASE_URL;
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
