/**
 * Simple wrapper of XMLHttpRequest with Promise
 */
export default function request(url, options) {
  options = _.extend({
    method: "GET",
    xhr: false,
    timeout: 30,
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
      if (xhr.status !== 200) {
        rejectError(`Response is not OK: "${xhr.status} ${xhr.statusText}" for url: ${url}`);
      } else {
        resolve(options.xhr ? xhr : xhr.responseText);
      }
    };
    xhr.onerror = () => {
      rejectError(`Error occurred on request for url: ${url}`);
    };
    xhr.ontimeout = () => {
      rejectError(`Request timed out for url: ${url}`, { isTimeout: true });
    };
    xhr.onabort = () => {
      rejectError(`Request has been aborted for url: ${url}`, { isAborted: true });
    };
    xhr.timeout = options.timeout;
    xhr.send(null);
  });
}

request.json = (url) => {
  return request(url).then(response => JSON.parse(response));
};
