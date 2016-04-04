/**
 * Simple wrapper of XMLHttpRequest with Promise
 */
export default function request(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    const rejectError = () => {
      const err = new Error(`Response: ${xhr.status} ${xhr.statusText}`);
      err.xhr = xhr;
      err.url = url;
      reject(err);
    };

    xhr.open("GET", url, true);
    xhr.onload = () => {
      if (xhr.status !== 200) {
        rejectError();
      } else {
        resolve(xhr.responseText);
      }
    };
    xhr.onerror = rejectError;
    xhr.send(null);
  });
}

request.json = (url) => {
  return request(url).then(response => JSON.parse(response));
};
