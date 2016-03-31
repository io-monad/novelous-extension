/**
 * Base class for novel sites.
 */
export default class Site {
  /**
   * @param {Object} settings - Settings.
   * @param {String} settings.name - Name of the site.
   * @param {String} settings.displayName - Display name of the site.
   * @param {String} settings.baseUrl - Base URL of the site.
   */
  constructor(settings) {
    settings = settings || {};
    this.name = settings.name || "";
    this.displayName = settings.displayName || "";
    this.baseUrl = settings.baseUrl;
  }

  /**
   * Publish an article to the site by opening new article page.
   *
   * @param {Publication} pub - Publication to be made.
   * @return {Promise}
   * @abstract
   */
  publish(pub) {  // eslint-disable-line
    throw new Error("`publish` must be overridden");
  }
}
