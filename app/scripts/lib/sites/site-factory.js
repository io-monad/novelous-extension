import Site from "./base";
import Sites from "./sites";

export default {
  /**
   * Create a Site instance with given settings.
   *
   * @param {String} siteName - Site name (key of sites)
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
};
