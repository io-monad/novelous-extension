import Site from "../site";
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
    super(_.defaults(settings, Kakuyomu.meta));
    this.formOpener = new KakuyomuFormOpener(this.baseUrl);
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

Kakuyomu.meta = {
  name: "kakuyomu",
  displayName: "カクヨム",
  baseUrl: "https://kakuyomu.jp",
};
