import KakuyomuAPI from "./api";
import KakuyomuURL from "./url";
import publish from "./publish";

let api;

/**
 * Site "Kakuyomu" (kakuyomu.jp)
 */
export default class Kakuyomu {
  /** @return {string} */
  static get name() { return "kakuyomu"; }
  /** @return {string} */
  static get iconUrl() { return "/images/sites/kakuyomu.png"; }
  /** @return {string} */
  static get url() { return KakuyomuURL.getTopURL(); }
  /** @return {KakuyomuAPI} */
  static get API() { return api || (api = new KakuyomuAPI); }
  /** @return {KakuyomuURL} */
  static get URL() { return KakuyomuURL; }

  static publish(...args) { return publish.apply(null, args); }
}
