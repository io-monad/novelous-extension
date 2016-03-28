import Publication from "./publication";

/**
 * Publisher that publishes article to novel sites.
 */
export default class Publisher {
  /**
   * @param {Object} [settings] - Settings.
   * @param {Site[]} [settings.sites] - Sites used for publishing.
   */
  constructor(settings) {
    settings = settings || {};
    this.sites = _.keyBy(settings.sites || [], "name");
  }

  /**
   * @param {Site} site - Site to be registered.
   */
  registerSite(site) {
    this.sites[site.name] = site;
  }

  /**
   * @param {Publication[]|Object[]} pubs - Publications to be made.
   * @return {Promise}
   */
  publishAll(pubs) {
    if (!_.isArray(pubs)) return Promise.reject("pubs is not array");
    const promises = _.map(pubs, pub => this.publish(pub));
    return Promise.all(promises);
  }

  /**
   * @param {Publication|Object} pub - A Publication to be made.
   * @return {Promise}
   */
  publish(pub) {
    return new Promise((resolve, reject) => {
      if (!(pub instanceof Publication)) pub = new Publication(pub);

      const sites = _.keys(pub.sites);
      Promise.all(_.map(sites, site => this.publishToSite(pub, site)))
      .then(results => {
        resolve(_.keyBy(results, (result, i) => sites[i]));
      })
      .catch(reject);
    });
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
    return this.sites[siteName].publish(pub);
  }
}
