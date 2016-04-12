import _ from "lodash";
import SiteClient from "../site-client";
import KakuyomuURL from "./url";

const APIClasses = {
  NovelFetcher: () => require("./api/novel-fetcher").default,
  ReviewLister: () => require("./api/review-lister").default,
  UserNovelLister: () => require("./api/user-novel-lister").default,
  MyNovelLister: () => require("./api/my-novel-lister").default,
};

/**
 * Kakuyomu API
 */
export default class KakuyomuAPI {
  /**
   * @param {Object} [options] - Options.
   * @param {Object|SiteClient} [options.client]
   *     Client settings or SiteClient instance.
   */
  constructor(options) {
    this.options = options || {};
    if (!(this.options.client instanceof SiteClient)) {
      this.options.client = new SiteClient(_.extend({
        sessionCookies: ["dlsc"],
        loginFormUrlTester: (url) => _.startsWith(url, KakuyomuURL.getLoginFormURL()),
        loginRequiredUrlTester: (url) => _.startsWith(url, KakuyomuURL.getMyTopURL()),
      }, this.options.client));
    }
    this._api = {};
  }

  get client() {
    return this.options.client;
  }

  _getAPI(name) {
    return this._api[name] || (this._api[name] = (() => {
      const APIClass = APIClasses[name]();
      return new APIClass(this.options);
    })());
  }

  getNovel(novelId) {
    return this._getAPI("NovelFetcher").fetchNovel(novelId);
  }

  listReviewsByNovelId(novelId) {
    return this._getAPI("ReviewLister").listReviews(novelId);
  }

  listNovelsByUserId(userId) {
    return this._getAPI("UserNovelLister").listNovelsOfUser(userId);
  }

  listMyNovelIds() {
    return this._getAPI("MyNovelLister").listNovelIds();
  }

  listMyNovels() {
    return this._getAPI("MyNovelLister").listNovels();
  }
}
