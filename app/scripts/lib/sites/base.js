/**
 * Base class for novel sites.
 */
export default class Site {
  /**
   * @param {Object} settings - Settings.
   * @param {String} settings.name - Name of the site.
   * @param {String} settings.displayName - Display name of the site.
   * @param {String} settings.baseUrl - Base URL of the site.
   */
  constructor(settings) {
    settings = settings || {};
    this.name = settings.name || "";
    this.displayName = settings.displayName || "";
    this.baseUrl = settings.baseUrl;
  }

  /**
   * Get a path for publishing new article page.
   *
   * @param {Publication} pub - Publication to be made.
   */
  getPublishPath(pub) { // eslint-disable-line no-unused-vars
    throw new Error(`Need to override: ${this.name} #getPublishPath`);
  }

  /**
   * Get a code to be executed on new article page for publishing.
   *
   * @param {Publication} pub - Publication to be made.
   */
  getCodeForPublishPage(pub) { // eslint-disable-line no-unused-vars
    throw new Error(`Need to override: ${this.name} #getCodeForPublishPage`);
  }

  /**
   * Publish an article to the site by opening new article page.
   *
   * @param {Publication} pub - Publication to be made.
   * @return {Promise}
   */
  publish(pub) {
    return new Promise((resolve, reject) => {
      const publishUrl = this.baseUrl + this.getPublishPath(pub);
      const code = this._wrapInjectCode(this.getCodeForPublishPage(pub));
      chrome.tabs.create({ url: publishUrl }, (tab) => {
        chrome.tabs.executeScript(tab.id, { code }, (results) => {
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
   * Wrap a code with anonymous function and try-catch.
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
