import Site from "../site";
import kakuyomuMeta from "./meta.json";
import KakuyomuNovelFetcher from "./novel-fetcher";
import KakuyomuUserNovelLister from "./user-novel-lister";
import KakuyomuFormOpener from "./form-opener";

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
    this.novelFetcher = settings.novelFetcher || new KakuyomuNovelFetcher(this.baseUrl);
    this.userNovelLister = settings.userNovelLister || new KakuyomuUserNovelLister(this.baseUrl);
    this.formOpener = settings.formOpener || new KakuyomuFormOpener(this.baseUrl);
  }

  /**
   * Fetch novel data from Kakuyomu.
   *
   * @param {string} novelId - Novel ID.
   * @return {Promise} Fetched novel data.
   * @see KakuyomuNovelFetcher
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
   * @see KakuyomuFormOpener
   */
  publish(pub) {
    return this.formOpener.openForm(pub);
  }
}

Kakuyomu.meta = kakuyomuMeta;
