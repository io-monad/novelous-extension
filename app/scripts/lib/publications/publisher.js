import Publication from "./publication";
import SiteFactory from "../sites/site-factory";

/**
 * Publisher that publishes article to novel sites.
 */
export default class Publisher {
  /**
   * @param {Object} [settings] - Settings.
   * @param {Object} [settings.sites] - Site settings used for publishing.
   *     This is an Object with site name keys.
   *     A value can be an Object of site settings, or Site instance, or
   *     just `true` for using default options.
   */
  constructor(settings) {
    settings = settings || {};
    this.sites = this._buildSites(settings.sites || []);
  }

  /** @private */
  _buildSites(siteSettings) {
    const sites = {};
    _.each(siteSettings, (settings, siteName) => {
      const site = SiteFactory.create(siteName, settings);
      if (site) {
        sites[siteName] = site;
      }
    });
    return sites;
  }

  /**
   * Publish a set of Publications.
   *
   * @param {Publication[]|Object[]} pubs - A set of Publications to be made.
   * @return {Promise}
   */
  publishAll(pubs) {
    if (!_.isArray(pubs)) return Promise.reject("pubs is not array");
    const promises = _.map(pubs, pub => this.publish(pub));
    return Promise.all(promises);
  }

  /**
   * Publish a single Publication.
   *
   * @param {Publication|Object} pub - A Publication to be made.
   * @return {Promise}
   */
  publish(pub) {
    if (!(pub instanceof Publication)) pub = new Publication(pub);
    const promises = _.map(pub.sites, (site, name) => this.publishToSite(pub, name));
    return Promise.all(promises);
  }

  /**
   * Publish to single site.
   *
   * @param {Publication} pub - Publication to be made.
   * @param {string} siteName - Site name the article is published to.
   * @return {Promise}
   */
  publishToSite(pub, siteName) {
    if (!this.sites[siteName]) return Promise.reject(`Unknown site: ${siteName}`);
    if (!(pub instanceof Publication)) pub = new Publication(pub);
    return this.sites[siteName].publish(pub);
  }
}
