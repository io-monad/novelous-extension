import Site from "../site";
import narouMeta from "./meta.json";
import NarouMyNovelLister from "./my-novel-lister";
import NarouMyMessageLister from "./my-message-lister";
import NarouMyCommentLister from "./my-comment-lister";
import NarouMyReviewLister from "./my-review-lister";
import NarouNovelFetcher from "./novel-fetcher";
import NarouFormOpener from "./form-opener";
import NarouItemType from "./item-type";

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
    this.myNovelLister = settings.myNovelLister || new NarouMyNovelLister(settings);
    this.myMessageLister = settings.myMessageLister || new NarouMyMessageLister(settings);
    this.myCommentLister = settings.myCommentLister || new NarouMyCommentLister(settings);
    this.myReviewLister = settings.myReviewLister || new NarouMyReviewLister(settings);
    this.novelFetcher = settings.novelFetcher || new NarouNovelFetcher(settings.ncodeBaseUrl);
    this.formOpener = settings.formOpener || new NarouFormOpener(settings.baseUrl);
  }

  /**
   * Get latest item data from Narou.
   *
   * @param {string} itemType - Item type from `NarouItemType`.
   * @param {string} [itemId] - Item ID.
   * @return {Promise}
   */
  getItem(itemType, itemId) {
    switch (itemType) {
      case NarouItemType.MY_NOVELS:
        return this.myNovelLister.listNovels();
      case NarouItemType.MY_MESSAGES:
        return this.myMessageLister.listReceivedMessages();
      case NarouItemType.MY_COMMENTS:
        return this.myCommentLister.listReceivedComments();
      case NarouItemType.MY_REVIEWS:
        return this.myReviewLister.listReceivedReviews();
      case NarouItemType.NOVEL:
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
   */
  publish(pub) {
    return this.formOpener.openForm(pub);
  }
}

Narou.meta = narouMeta;
Narou.ItemType = NarouItemType;
