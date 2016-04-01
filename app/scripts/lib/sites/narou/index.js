import Site from "../site";
import narouMeta from "./meta.json";
import NarouNovelFetcher from "./novel-fetcher";
import NarouMessageLister from "./message-lister";
import NarouFormOpener from "./form-opener";
import NarouItemType from "./item-type";
import NarouMessageType from "./message-type";

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
    this.ncodeBaseUrl = settings.ncodeBaseUrl;
    this.mypageBaseUrl = settings.mypageBaseUrl;
    this.novelFetcher = settings.novelFetcher || new NarouNovelFetcher(this.ncodeBaseUrl);
    this.messageLister = settings.messageLister || new NarouMessageLister(this.baseUrl);
    this.formOpener = settings.formOpener || new NarouFormOpener(this.baseUrl);
  }

  /**
   * Get latest item data from Narou.
   *
   * @param {string} itemType - Item type from `NarouItemType`.
   * @param {string} itemId - Item ID.
   * @return {Promise}
   */
  getItem(itemType, itemId) {
    switch (itemType) {
      case NarouItemType.NOVEL:
        return this.novelFetcher.fetchNovel(itemId);
      case NarouItemType.MESSAGES:
        return this.messageLister.listMessages(itemId);
      default:
        return Promise.reject(`Unknown item type ${itemType}`);
    }
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
Narou.ItemType = NarouItemType;
Narou.MessageType = NarouMessageType;
