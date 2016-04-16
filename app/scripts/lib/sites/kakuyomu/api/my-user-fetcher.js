import scrape from "../../../util/scrape";
import SiteClient from "../../site-client";
import KakuyomuURL from "../url";

/**
 * @typedef {Object} KakuyomuMyUser
 * @property {string}   id - ID of the user.
 * @property {string}   name - Name of the user.
 * @property {string}   description - Profile description of the user.
 * @property {boolean}  newsCommentEnabled - `true` if allow comments on news.
 */

/**
 * Fetching my user info in Kakuyomu.
 */
export default class KakuyomuMyUserFetcher {
  /**
   * @param {Object} [options] - Options.
   * @param {SiteClient} [options.client] - SiteClient used to fetch content.
   */
  constructor(options) {
    options = options || {};
    this.client = options.client || new SiteClient;
  }

  /**
   * Fetch my user info.
   *
   * @return {Promise.<KakuyomuMyUser>} My user info.
   */
  fetchUser() {
    return this.client.fetch(KakuyomuURL.getSettingsURL())
      .then(scrape).then($ => this._parsePage($));
  }

  _parsePage($) {
    const user = {};
    user.id = $.text($("#accountInfo-screenName-currentValue")).replace(/^@/, "");
    user.name = $.text($("#accountInfo-profile input[name=pen_name]").val());
    user.description = $.text($("#accountInfo-profile textarea[name=profile_text]").val());
    user.newsCommentEnabled = $("#input-newsComments-enabled").prop("checked");
    return user;
  }
}
