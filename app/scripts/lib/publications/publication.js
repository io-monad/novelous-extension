/**
 * Publication that represents a publication to novel sites.
 */
export default class Publication {
  /**
   * @param {Object} settings - Publication settings.
   * @param {string} settings.title - Title of the article.
   * @param {string} settings.body - Body of the article.
   * @param {string|Date} settings.time - When the article will be published at.
   * @param {Object[]} settings.sites
   *     Site names and settings where the article is published to.
   *     Keys should be names of sites and values should be settings.
   */
  constructor(settings = {}) {
    this.title = settings.title || "";
    this.body = settings.body || "";
    this.time = settings.time || null;
    this.sites = settings.sites || {};
  }

  set time(time) {
    this._time = time ? new Date(time) : null;
  }
  get time() {
    return this._time;
  }
}
