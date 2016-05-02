/**
 * Open a page in new tab and execute script on the page.
 *
 * @param {string} url - A URL of the opening page.
 * @param {string} code - A code to be executed on the page.
 * @param {Object} [options] - Options.
 * @param {boolean} [options.update=false] - Set this to `true` for updating existing tab.
 * @return {Promise}
 */
export default function openPage(url, code, options) {
  options = options || {};
  return new Promise(resolve => {
    if (options.update) {
      chrome.tabs.query({ url }, (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.update(tabs[0].id, { active: true }, tab => {
            resolve(executeCode(tab, code));
          });
        } else {
          chrome.tabs.create({ url }, tab => {
            resolve(executeCode(tab, code));
          });
        }
      });
    } else {
      chrome.tabs.create({ url }, tab => {
        resolve(executeCode(tab, code));
      });
    }
  });
}

/**
 * @param {chrome~Tab} tab
 * @param {string} code
 * @return {Promise}
 * @private
 */
function executeCode(tab, code) {
  return new Promise((resolve, reject) => {
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
    }());
  `;
}
