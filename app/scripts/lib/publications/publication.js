/**
 * Publication that represents a publication to novel sites.
 */
export default class Publication {
  /**
   * @param {Object} settings - Publication settings.
   * @param {String} settings.title - Title of the article.
   * @param {String} settings.body - Body of the article.
   * @param {String|Date} settings.time - When the article will be published at.
   * @param {Object[]} settings.sites
   *     Site names and settings where the article is published to.
   *     Keys should be names of sites and values should be settings.
   */
  constructor(settings = {}) {
    this.title = settings.title || "";
    this.body = settings.body || "";
    this.time = settings.time ? new Date(settings.time) : null;
    this.sites = settings.sites || {};
  }
}
