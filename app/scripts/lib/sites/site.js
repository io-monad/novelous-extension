import SiteClient from "./site-client";

/**
 * Base class for novel sites.
 */
export default class Site {
  /**
   * @param {Object} settings - Settings of the site.
   * @param {string} settings.name - Name of the site.
   * @param {string} settings.url - URL of the top page of the site.
   * @param {string} settings.baseUrl - Base URL of the site.
   * @param {Object} settings.fetchers - Map of fetcher classes.
   * @param {Object|SiteClient} settings.client
   *    Settings for SiteClient constructor, or SiteClient instance.
   */
  constructor(settings) {
    this.settings = settings || {};
    this._fetchers = {};
    this._client = null;
  }

  /**
   * @return {string} Name of the site.
   */
  get name() {
    return this.settings.name;
  }

  /**
   * @return {string} URL of the top page of the site.
   */
  get url() {
    return this.settings.url;
  }

  /**
   * @return {string} Base URL of the site.
   */
  get baseUrl() {
    return this.settings.baseUrl;
  }

  /**
   * @return {SiteClient}
   */
  get client() {
    if (!this._client) {
      if (this.settings.client instanceof SiteClient) {
        this._client = this.settings.client;
      } else {
        this._client = new SiteClient(this.settings.client);
      }
    }
    return this._client;
  }

  /**
   * Get a fetcher for contents of the server.
   *
   * It returns a singleton instance for the same fetcherType.
   *
   * @param {string} fetcherType - Fetcher type to get.
   * @return {Object} Fetcher instance.
   */
  getFetcher(fetcherType) {
    return this._fetchers[fetcherType] ||
      (this._fetchers[fetcherType] = this._createFetcher(fetcherType));
  }

  _createFetcher(fetcherType) {
    const Fetcher = this.settings.fetchers[fetcherType];
    if (!Fetcher) {
      throw new Error(`Unknown fetcherType: ${fetcherType}`);
    }
    return new Fetcher(this);
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
