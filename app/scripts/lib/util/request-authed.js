import _ from "lodash";
import request from "./request";
import promises from "./promises";

class LoginRequiredError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = "LoginRequiredError";
    this.originalError = originalError;
  }
}

/**
 * Build a function to send a request for the user's content with
 * checking the user is logged in on that site.
 *
 * If not logged in, it rejects request with `LoginRequiredError`.
 *
 * @param {Object} params - Parameters.
 * @param {string|string[]} [params.cookie] Name of cookie of login session.
 * @param {string|RegExp} [params.loginUrl] URL of login form, or RegExp to test a URL.
 * @return {Function} Built function.
 */
export default function buildRequestAuthed({ cookie, loginUrl }) {
  return (url, options) => {
    let promise;

    if (cookie) {
      promise = getLoginCookie(url, cookie).then(hasCookie => {
        if (!hasCookie) return notLoggedIn();
        return request(url, options);
      });
    } else {
      promise = request(url, options);
    }

    if (loginUrl) {
      promise = promise.catch(err => {
        if (isLoginRedirect(err, loginUrl)) throw notLoggedIn(err);
        throw err;
      });
    }

    return promise;
  };
}
buildRequestAuthed.LoginRequiredError = LoginRequiredError;

function getLoginCookie(url, cookieNames) {
  cookieNames = _.castArray(cookieNames || []);
  return promises.some(cookieNames, name => new Promise(resolve =>
    chrome.cookies.get({ url, name }, resolve)
  ));
}

function isLoginRedirect(err, loginUrl) {
  if (!err || !err.responseURL) return false;
  if (_.isRegExp(loginUrl)) return loginUrl.test(err.responseURL);
  return err.responseURL === loginUrl;
}

function notLoggedIn(originalError) {
  return Promise.reject(new LoginRequiredError("Not logged in", originalError));
}
