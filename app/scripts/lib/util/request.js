const logger = debug("request");

/**
 * Simple wrapper of XMLHttpRequest with Promise
 */
export default function request(url, options) {
  options = _.extend({
    method: "GET",
    xhr: false,
    timeout: 30000,
  }, options);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    const rejectError = (error, props) => {
      const err = new Error(error);
      err.xhr = xhr;
      err.url = url;
      if (props) _.extend(err, props);
      reject(err);
    };

    xhr.open(options.method, url, true);
    xhr.onload = () => {
      logger(`onload on ${url}`, xhr);
      if (xhr.status !== 200) {
        rejectError(`Response is not OK: "${xhr.status} ${xhr.statusText}" for url: ${url}`);
      } else if (xhr.responseURL && xhr.responseURL !== url) {
        rejectError(`Response is redirected to "${xhr.responseURL}" for url: ${url}`,
          { redirected: true, responseURL: xhr.responseURL });
      } else {
        resolve(options.xhr ? xhr : xhr.responseText);
      }
    };
    xhr.onerror = () => {
      logger(`onerror on ${url}`, xhr);
      rejectError(`Error occurred on request for url: ${url}`);
    };
    xhr.ontimeout = () => {
      logger(`ontimeout on ${url}`, xhr);
      rejectError(`Request timed out for url: ${url}`, { isTimeout: true });
    };
    xhr.onabort = () => {
      logger(`onabort on ${url}`, xhr);
      rejectError(`Request has been aborted for url: ${url}`, { isAborted: true });
    };
    xhr.timeout = options.timeout;
    xhr.send(null);

    logger(`Requesting ${options.method} ${url}`, xhr, options);
  });
}

request.json = (url) => {
  return request(url).then(response => JSON.parse(response));
};
