import Site from "../site";
import NarouOpenFormStrategy from "./open-form";

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
    this.publishStrategy = new NarouOpenFormStrategy(this.baseUrl);
  }

  publish(pub) {
    return this.publishStrategy.publish(pub);
  }
}

Narou.meta = {
  name: "narou",
  displayName: "小説家になろう",
  baseUrl: "http://syosetu.com",
};
