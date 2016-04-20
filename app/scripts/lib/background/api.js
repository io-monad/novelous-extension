/**
 * Controller methods to export
 */
const exportMethods = [
  "getAppData",
  "markBadgeAsSeen",
  "updateSubscriptions",
  "publishNovel",
];

/**
 * Build Exported API for application global
 *
 * @param {BackgroundController} controller
 * @returns {Object.<string, Function>} Map of API functions.
 */
export default function buildAPI(controller) {
  const api = {};
  exportMethods.forEach(method => {
    api[method] = controller[method].bind(controller);
  });
  return api;
}
buildAPI.list = exportMethods;
