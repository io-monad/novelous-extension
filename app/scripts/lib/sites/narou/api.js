import _ from "lodash";
import SiteClient from "../site-client";
import NarouURL from "./url";

const APIClasses = {
  NovelFetcher: () => require("./api/novel-fetcher").default,
  UserNovelLister: () => require("./api/user-novel-lister").default,
  MyNovelLister: () => require("./api/my-novel-lister").default,
  MyCommentLister: () => require("./api/my-comment-lister").default,
  MyReviewLister: () => require("./api/my-review-lister").default,
  MyMessageLister: () => require("./api/my-message-lister").default,
  MyBlogCommentLister: () => require("./api/my-blog-comment-lister").default,
};

/**
 * Narou API
 */
export default class NarouAPI {
  /**
   * @param {Object} [options] - Options.
   * @param {Object|SiteClient} [options.client]
   *     Client settings or SiteClient instance.
   */
  constructor(options) {
    this.options = options || {};
    if (!(this.options.client instanceof SiteClient)) {
      this.options.client = new SiteClient(_.extend({
        sessionCookies: ["autologin", "userl"],
        loginFormUrlTester: (url) => NarouURL.isLoginFormURL(url),
        loginRequiredUrlTester: (url) => NarouURL.isLoginRequiredURL(url),
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

  listNovelsByUserId(userId) {
    return this._getAPI("UserNovelLister").listNovelsOfUser(userId);
  }

  listMyNovels() {
    return this._getAPI("MyNovelLister").listNovels();
  }

  listMyReceivedComments() {
    return this._getAPI("MyCommentLister").listReceivedComments();
  }

  listMyReceivedReviews() {
    return this._getAPI("MyReviewLister").listReceivedReviews();
  }

  listMyReceivedMessages() {
    return this._getAPI("MyMessageLister").listReceivedMessages();
  }

  listMyReceivedBlogComments() {
    return this._getAPI("MyBlogCommentLister").listReceivedComments();
  }
}
