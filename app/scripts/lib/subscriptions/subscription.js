import EventEmitter from "eventemitter3";

/**
 * Subscription of novel sites.
 */
export default class Subscription extends EventEmitter {
  /**
   * @param {Object} settings - Settings.
   * @param {string} settings.siteName - Site name.
   * @param {string} settings.itemType - Item type. This depends on the site.
   * @param {string} settings.itemId - Item ID. This depends on the site.
   * @param {Object} settings.item - Item object. This depends on the site.
   * @param {number} settings.lastUpdatedAt - Timestamp of last update.
   */
  constructor(settings = {}) {
    super();
    this.settings = _.defaults(settings, {
      siteName: null,
      itemType: null,
      itemId: null,
      item: null,
      lastUpdatedAt: null,
    });
  }

  get id() {
    return [this.siteName, this.itemType, this.itemId].join("-");
  }
  get siteName() {
    return this.settings.siteName;
  }
  get itemType() {
    return this.settings.itemType;
  }
  get itemId() {
    return this.settings.itemId;
  }
  get item() {
    return this.settings.item;
  }
  set item(newItem) {
    const updated = !_.isEqual(this.settings.item, newItem);
    this.settings.item = newItem;
    if (updated) {
      this.settings.lastUpdatedAt = _.now();
      this.emit("update", this);
    }
  }
  get lastUpdatedAt() {
    return this.settings.lastUpdatedAt;
  }
}
