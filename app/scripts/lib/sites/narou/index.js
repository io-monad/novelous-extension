import Site from "../site";
import narouMeta from "./meta.json";
import NarouNovelFetcher from "./novel-fetcher";
import NarouUserNovelLister from "./user-novel-lister";
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
    this.ncodeBaseUrl = settings.ncodeBaseUrl;
    this.mypageBaseUrl = settings.mypageBaseUrl;
    this.novelFetcher = settings.novelFetcher || new NarouNovelFetcher(this.ncodeBaseUrl);
    this.userNovelLister = settings.userNovelLister || new NarouUserNovelLister(this.mypageBaseUrl);
    this.formOpener = settings.formOpener || new NarouFormOpener(this.baseUrl);
  }

  /**
   * Fetch novel data from Narou.
   *
   * @param {string} novelId - Novel ID.
   * @return {Promise} Fetched novel data.
   * @see NarouNovelFetcher
   */
  fetchNovel(novelId) {
    return this.novelFetcher.fetchNovel(novelId);
  }

  /**
   * Get a list of novels of a user.
   *
   * @param {string} userId - User ID.
   * @param {number} [page=1] - Page number to get.
   * @return {Promise} A promise that resolves to a list of novels.
   * @see KakuyomuUserNovelLister
   */
  listNovelsOfUser(userId, page = 1) {
    return this.userNovelLister.listNovelsOfUser(userId, page);
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
