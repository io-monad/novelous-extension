/**
 * Open a page in new tab and execute script on the page.
 *
 * @param {string} url - A URL of the opening page.
 * @param {string} code - A code to be executed on the page.
 * @return {Promise}
 */
export default function openPage(url, code) {
  return new Promise((resolve, reject) => {
    chrome.tabs.create({ url }, (tab) => {
      const wrapped = wrapInjectCode(code);
      chrome.tabs.executeScript(tab.id, { code: wrapped }, (results) => {
        // results = [error] or [null]
        if (results.length > 0 && results[0]) {
          reject(results[0]);
        } else {
          resolve();
        }
      });
    });
  });
}

/**
 * @param {string} code
 * @return {string}
 * @private
 */
function wrapInjectCode(code) {
  return `
    (function () {
      try {
        ${code}
      } catch (e) {
        return e.message || e;
      }
      return null;
    })();
  `;
}
