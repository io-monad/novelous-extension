import _ from "lodash";
import Site from "../site";
import narouMeta from "./meta.json";
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
    settings = _.defaults(settings, narouMeta);
    super(settings);
    this.formOpener = settings.formOpener || new NarouFormOpener(settings.baseUrl);
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
