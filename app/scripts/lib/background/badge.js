/**
 * Badge utility class
 */
export default class Badge {
  setCount(count) {
    count = Math.max(0, count);
    if (count === 0) {
      chrome.browserAction.setBadgeText({ text: "" });
    } else {
      chrome.browserAction.setBadgeText({ text: count.toString() });
    }
  }
}
