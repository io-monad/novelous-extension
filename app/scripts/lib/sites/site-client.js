import _ from "lodash";
import request from "../util/request";
import promises from "../util/promises";
import Cache from "../util/cache";

class LoginRequiredError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = "LoginRequiredError";
    this.originalError = originalError;
  }
}

/**
 * Client for fetching contents from remote site.
 */
export default class SiteClient {
  /**
   * @param {Object} settings - Settings.
   * @param {string[]} settings.sessionCookies
   *     Names of session cookies used in the site.
   *     This is used to determine whether the user is logged in.
   * @param {RegExp|Function} settings.loginFormUrlTester
   *     Tester RegExp or Function that takes a URL as parameter and
   *     should return `true` if the URL is a login form.
   *     This is used to determine the request was redirected to the login form.
   * @param {RegExp|Function} settings.loginRequiredUrlTester
   *     Tester RegExp or Function that takes a URL as parameter and
   *     should return `true` if the user has to be logged in to the site to
   *     fetch that URL.
   *     This is used to determine whether login check is required before
   *     making a request to the server.
   * @param {number} settings.fetchInterval
   *     Minimum interval milliseconds for each request.
   *     It suspends a request to the server until this interval is elapsed.
   * @param {boolean} settings.caching
   *     Set `true` to cache response from the server.
   * @param {number} settings.cacheExpiresIn
   *     Cached response expires in this milliseconds.
   */
  constructor(settings) {
    settings = _.extend({
      sessionCookies: [],
      loginFormUrlTester: null,
      loginRequiredUrlTester: null,
      fetchInterval: 3 * 1000,
      caching: true,
      cacheExpiresIn: 5 * 60 * 1000,
    }, settings);

    this.sessionCookies = _.castArray(settings.sessionCookies || []);
    this.loginFormUrlTester = settings.loginFormUrlTester;
    this.loginRequiredUrlTester = settings.loginRequiredUrlTester;
    this.fetchInterval = settings.fetchInterval;
    this.lastFetchedAt = null;
    this.cache = new Cache({
      enabled: settings.caching,
      expiresIn: settings.cacheExpiresIn,
    });
  }

  /**
   * Fetch contents from the server.
   *
   * This will suspend a request until `fetchInterval` has been elapsed,
   * and will cache a response if `caching` is set to `true`.
   *
   * @param {string} url - URL to be fetched.
   * @return {Promise.<string>} Reponse body from the server.
   */
  fetch(url) {
    return this.cache.memoize(url, () => this._throttledRequest(url));
  }

  _throttledRequest(url) {
    return new Promise(resolve => {
      const next = () => {
        const now = _.now();
        if (!this.lastFetchedAt || now >= this.lastFetchedAt + this.fetchInterval) {
          this.lastFetchedAt = now;
          resolve(this._request(url));
        } else {
          setTimeout(next, this.lastFetchedAt + this.fetchInterval - now);
        }
      };
      next();
    });
  }

  _request(url) {
    if (this._isLoginRequiredURL(url)) {
      return this._requestForLoginRequiredURL(url);
    } else {
      return this._requestForURL(url);
    }
  }

  _requestForLoginRequiredURL(url) {
    return this._checkSessionCookies(url).then(hasCookie => {
      if (!hasCookie) {
        throw new LoginRequiredError("Login required (no session cookies)");
      }
      return this._requestForURL(url);
    });
  }

  _requestForURL(url) {
    return request(url).catch(err => {
      if (err.name === "RequestError" && err.reason === request.REDIRECTED) {
        if (err.xhr.responseURL && this._isLoginFormURL(err.xhr.responseURL)) {
          throw new LoginRequiredError("Login required (redirected to login form)", err);
        }
      }
      throw err;
    });
  }

  _checkSessionCookies(url) {
    if (this.sessionCookies.length === 0) return Promise.resolve(false);
    return promises.some(this.sessionCookies, name => new Promise(resolve =>
      chrome.cookies.get({ url, name }, resolve)
    ));
  }

  _isLoginRequiredURL(url) {
    return this._testUrl(url, this.loginRequiredUrlTester);
  }

  _isLoginFormURL(url) {
    return this._testUrl(url, this.loginFormUrlTester);
  }

  _testUrl(url, tester) {
    if (!tester) {
      return false;
    } else if (_.isRegExp(tester)) {
      return tester.test(url);
    } else if (_.isFunction(tester)) {
      return tester.call(null, url);
    } else if (_.isArray(tester)) {
      return tester.indexOf(url) >= 0;
    } else {
      return _.isEqual(url, tester);
    }
  }
}

SiteClient.LoginRequiredError = LoginRequiredError;
