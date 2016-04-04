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
 */
export default function buildAPI(controller) {
  const api = {};
  exportMethods.forEach(method => {
    api[method] = controller[method].bind(controller);
  });
  return api;
}
