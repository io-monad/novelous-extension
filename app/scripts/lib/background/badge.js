/**
 * Badge utility class
 */
export default class Badge {
  constructor() {
    this.counts = {};
  }

  setCount(id, count) {
    count = Math.max(0, count);
    if (this.counts[id] !== count) {
      this.counts[id] = count;
      this.update();
    }
  }

  update() {
    const sum = _.sum(_.values(this.counts));
    if (sum === 0) {
      chrome.browserAction.setBadgeText({ text: "" });
    } else {
      chrome.browserAction.setBadgeText({ text: sum.toString() });
    }
  }

  clear() {
    this.counts = {};
    this.update();
  }
}
