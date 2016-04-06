import Publication from "./publication";
import SiteFactory from "../sites/site-factory";

/**
 * Publisher that publishes article to novel sites.
 */
export default class Publisher {
  /**
   * @param {Object.<string, Object>} siteSettings - A map of site name and Site settings.
   */
  constructor(siteSettings) {
    this.siteSettings = siteSettings;
  }

  set siteSettings(siteSettings) {
    this.sites = SiteFactory.createMap(siteSettings || {});
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
