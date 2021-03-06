import _ from "lodash";
const logger = debug("request");

const Reasons = {
  BAD_RESPONSE: "BAD_RESPONSE",
  REDIRECTED: "REDIRECTED",
  ERROR: "ERROR",
  ABORTED: "ABORTED",
  TIMEOUT: "TIMEOUT",
};

class RequestError extends Error {
  static Reasons = Reasons;
  constructor(reason, message, xhr, url) {
    super(message);
    this.name = "RequestError";
    this.reason = reason;
    this.xhr = xhr;
    this.url = url;
  }
  get responseURL() {
    return this.xhr.responseURL;
  }
}

/**
 * Simple wrapper of XMLHttpRequest with Promise
 *
 * @param {string} url - URL to request.
 * @param {Object} [options] - Options.
 * @param {string} [options.method="GET"] - Request method.
 * @param {boolean} [options.xhr=false] - If `true`, returns XHR instead of response body.
 * @param {number} [options.timeout=30000] - Timeout milliseconds.
 * @return {Promise.<string>|Promise.<XMLHttpRequest>}
 *     If `options.xhr` is `true`, it returns `Promise.<XMLHttpRequest>`.
 *     Otherwise it returns `Promise.<string>` of response body.
 */
export default function request(url, options) {
  options = _.extend({
    method: "GET",
    xhr: false,
    timeout: 30000,
  }, options);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    const rejectError = (name, message) => {
      reject(new RequestError(name, message, xhr, url));
    };

    xhr.open(options.method, url, true);
    xhr.onload = () => {
      logger(`onload on ${url}`, xhr);
      if (xhr.status !== 200) {
        rejectError(Reasons.BAD_RESPONSE, `Response is not OK: "${xhr.status} ${xhr.statusText}"`);
      } else if (xhr.responseURL && xhr.responseURL !== url) {
        rejectError(Reasons.REDIRECTED, `Response is redirected to "${xhr.responseURL}"`);
      } else {
        resolve(options.xhr ? xhr : xhr.responseText);
      }
    };
    xhr.onerror = () => {
      logger(`onerror on ${url}`, xhr);
      rejectError(Reasons.ERROR, "Error occurred on request");
    };
    xhr.ontimeout = () => {
      logger(`ontimeout on ${url}`, xhr);
      rejectError(Reasons.TIMEOUT, "Request timed out");
    };
    xhr.onabort = () => {
      logger(`onabort on ${url}`, xhr);
      rejectError(Reasons.ABORTED, "Request has been aborted");
    };
    xhr.timeout = options.timeout;
    xhr.send(null);

    logger(`Requesting ${options.method} ${url}`, xhr, options);
  });
}

request.json = (url) => {
  return request(url).then(response => JSON.parse(response));
};

request.RequestError = RequestError;
_.extend(request, Reasons);
