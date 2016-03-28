import Publisher from "./publisher";
import Sites from "../sites/sites";

/**
 * @param {Options} options - Options for publisher.
 * @return {Publisher}
 */
export default function buildPublisher(options) {
  const publisher = new Publisher();
  _.each(options.sites, (settings, siteName) => {
    if (settings.enabled) {
      const site = new Sites[siteName](settings);
      publisher.registerSite(site);
    }
  });
  return publisher;
}
