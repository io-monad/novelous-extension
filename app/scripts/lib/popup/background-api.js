import API from "../background/api";

export default _.transform(API.list, (api, method) => {
  api[method] = (...args) => {
    return new Promise((resolve) => {
      chrome.runtime.getBackgroundPage(background => {
        resolve(background.NovelousAPI[method].apply(background, args));
      });
    });
  };
}, {});
