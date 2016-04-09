import _ from "lodash";
import Site from "./site";
import Sites from "./sites";

export default {
  /**
   * Create a Site instance with given settings.
   *
   * @param {string} siteName - Site name (key of sites)
   * @param {boolean|Object} settings - Site settings.
   *     This can be an Object of site settings, or Site instance, or
   *     just `true` for using default options.
   * @return {Site|null} Created Site instance.
   *     Or `null` if settings indicates that the site is disalbed.
   */
  create(siteName, settings) {
    if (!Sites[siteName]) {
      throw new Error(`Unknown site name: ${siteName}`);
    }
    if (settings instanceof Site) {
      return settings;
    } else if (settings === true) {
      return new Sites[siteName]();
    } else if (_.isObject(settings)) {
      return new Sites[siteName](settings);
    }
    return null;
  },

  /**
   * Create a map of Site instances with given settings map.
   *
   * @param {Object.<string, Site|boolean|Object>} settingsMap
   *     A map of site name keys and site setting values.
   * @return {Object.<string, Site>} Created map of Site instances.
   *     This does not contain disabled sites.
   */
  createMap(settingsMap) {
    const sites = _.mapValues(settingsMap, (settings, siteName) => this.create(siteName, settings));
    return _.omitBy(sites, _.isNull);
  },
};
