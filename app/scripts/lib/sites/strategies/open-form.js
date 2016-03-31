/**
 * Publish strategy - Open a page for publish form.
 */
export default class OpenFormStrategy {
  /**
   * Publish an article to the site by opening new article page.
   *
   * @param {Publication} pub - Publication to be made.
   * @return {Promise}
   */
  publish(pub) {
    return new Promise((resolve, reject) => {
      Promise.all([
        Promise.resolve(this._getURL(pub)),
        Promise.resolve(this._getCode(pub)),
      ])
      .then(([url, code]) => {
        const wrapped = this._wrapInjectCode(code);
        chrome.tabs.create({ url }, (tab) => {
          chrome.tabs.executeScript(tab.id, { code: wrapped }, (results) => {
            // results = [error] or [null]
            if (results.length > 0 && results[0]) {
              reject(results[0]);
            } else {
              resolve();
            }
          });
        });
      })
      .catch(reject);
    });
  }

  /**
   * @param {Publication} pub - A Publication to be published.
   * @return {string|Promise} A URL of an opening page.
   *     Or a Promise that resolves to a URL.
   * @abstract
   */
  _getURL(pub) {  // eslint-disable-line
    throw new Error("_getURL must be overridden");
  }

  /**
   * @param {Publication} pub - A Publication to be published.
   * @return {string|Promise} A code to be injected into the opened page.
   *     Or a Promise that resolves to a code.
   *     This code should set parameters of the publication to a publish form.
   * @abstract
   */
  _getCode(pub) {  // eslint-disable-line
    throw new Error("_getCode must be overridden");
  }

  /**
   * Wrap a code with anonymous function and try-catch.
   * @param {string} code
   * @return {string}
   * @private
   */
  _wrapInjectCode(code) {
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
}
