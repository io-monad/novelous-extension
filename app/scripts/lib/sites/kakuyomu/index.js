import Site from "../site";
import KakuyomuOpenFormStrategy from "./open-form";

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
    this.publishStrategy = new KakuyomuOpenFormStrategy(this.baseUrl);
  }

  publish(pub) {
    return this.publishStrategy.publish(pub);
  }
}

Kakuyomu.meta = {
  name: "kakuyomu",
  displayName: "カクヨム",
  baseUrl: "https://kakuyomu.jp",
};
