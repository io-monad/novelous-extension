import _ from "lodash";
import Site from "../site";
import kakuyomuMeta from "./meta.json";
import kakuyomuFetchers from "./fetchers";
import KakuyomuFormOpener from "./form-opener";

const DEFAULT_SETTINGS = _.extend({
  fetchers: kakuyomuFetchers,
  client: {
    sessionCookies: ["dlsc"],
    loginFormUrlTester: (url) => _.startsWith(url, `${kakuyomuMeta.baseUrl}/login`),
    loginRequiredUrlTester: (url) => _.startsWith(url, `${kakuyomuMeta.baseUrl}/my`),
  },
}, kakuyomuMeta);

/**
 * Site "Kakuyomu" (kakuyomu.jp)
 *
 * Publication site settings:
 * - `novelId`: `String` A Novel ID of publishing novels.
 */
export default class Kakuyomu extends Site {
  /**
   * @param {Object} [settings] - Settings.
   */
  constructor(settings) {
    settings = _.defaultsDeep({}, settings, DEFAULT_SETTINGS);
    super(settings);
    this.formOpener = settings.formOpener || new KakuyomuFormOpener(this.baseUrl);
  }

  /**
   * Publish an episode by opening a publish form.
   *
   * @param {Publication} pub - A Publication to be published.
   * @return {Promise}
   * @see KakuyomuFormOpener
   */
  publish(pub) {
    return this.formOpener.openForm(pub);
  }
}

Kakuyomu.meta = kakuyomuMeta;
Kakuyomu.FetcherTypes = _.keyBy(_.keys(kakuyomuFetchers));
