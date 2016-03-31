import Site from "../site";
import NarouFormOpener from "./form-opener";

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
    super(_.defaults(settings, Narou.meta));
    this.formOpener = new NarouFormOpener(this.baseUrl);
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

Narou.meta = {
  name: "narou",
  displayName: "小説家になろう",
  baseUrl: "http://syosetu.com",
};
