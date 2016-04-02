import Site from "../site";
import kakuyomuMeta from "./meta.json";
import KakuyomuMyNovelLister from "./my-novel-lister";
import KakuyomuNovelFetcher from "./novel-fetcher";
import KakuyomuFormOpener from "./form-opener";
import KakuyomuItemType from "./item-type";

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
    this.myNovelLister = settings.myNovelLister || new KakuyomuMyNovelLister(settings);
    this.novelFetcher = settings.novelFetcher || new KakuyomuNovelFetcher(settings);
    this.formOpener = settings.formOpener || new KakuyomuFormOpener(this.baseUrl);
  }

  /**
   * Get latest item data from Narou.
   *
   * @param {string} itemType - Item type from `KakuyomuItemType`.
   * @param {string} itemId - Item ID.
   * @return {Promise}
   */
  getItem(itemType, itemId) {
    switch (itemType) {
      case KakuyomuItemType.MY_NOVELS:
        return this.myNovelLister.listNovels();
      case KakuyomuItemType.NOVEL:
        return this.novelFetcher.fetchNovel(itemId);
      default:
        return Promise.reject(`Unknown item type ${itemType}`);
    }
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
Kakuyomu.ItemType = KakuyomuItemType;
