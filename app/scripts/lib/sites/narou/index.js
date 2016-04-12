import NarouURL from "./url";
import NarouAPI from "./api";
import publish from "./publish";

let api;

/**
 * Site "Syosetuka ni Narou" (syosetu.com)
 */
export default class Narou {
  /** @return {string} */
  static get name() { return "narou"; }
  /** @return {string} */
  static get iconUrl() { return "/images/sites/narou.png"; }
  /** @return {string} */
  static get url() { return NarouURL.getTopURL(); }
  /** @return {NarouAPI} */
  static get API() { return api || (api = new NarouAPI); }
  /** @return {NarouURL} */
  static get URL() { return NarouURL; }

  static publish(...args) { return publish.apply(null, args); }
}
