import _ from "lodash";
import Site from "../site";
import narouMeta from "./meta.json";
import narouFetchers from "./fetchers";
import NarouFormOpener from "./form-opener";

const DEFAULT_SETTINGS = _.extend({
  fetchers: narouFetchers,
  client: {
    sessionCookies: ["autologin", "userl"],
    loginFormUrlTester: (url) => _.startsWith(url, `${narouMeta.sslBaseUrl}/login`),
    loginRequiredUrlTester: (url) => _.startsWith(url, `${narouMeta.baseUrl}/`),
  },
}, narouMeta);

/**
 * Site "Syosetuka ni Narou" (syosetu.com)
 *
 * Publication site settings:
 * - `novelId`: `String` A Novel ID of publishing novel.
 */
export default class Narou extends Site {
  /**
   * @param {Object} [settings] - Settings.
   */
  constructor(settings) {
    settings = _.defaultsDeep({}, settings, DEFAULT_SETTINGS);
    super(settings);
    this.formOpener = settings.formOpener || new NarouFormOpener(settings.baseUrl);
  }

  get sslBaseUrl() {
    return this.settings.sslBaseUrl;
  }
  get apiBaseUrl() {
    return this.settings.apiBaseUrl;
  }
  get ncodeBaseUrl() {
    return this.settings.ncodeBaseUrl;
  }

  /**
   * Publish an episode by opening a publish form.
   *
   * @param {Publication} pub - A Publication to be published.
   * @return {Promise}
   */
  publish(pub) {
    return this.formOpener.openForm(pub);
  }
}

Narou.meta = narouMeta;
Narou.FetcherTypes = _.keyBy(_.keys(narouFetchers));
