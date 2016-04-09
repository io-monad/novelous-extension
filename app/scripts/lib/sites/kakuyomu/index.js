import _ from "lodash";
import Site from "../site";
import kakuyomuMeta from "./meta.json";
import KakuyomuFormOpener from "./form-opener";

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
    settings = _.defaults(settings, kakuyomuMeta);
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
