import WatchStrategy from "./base";

export default class WatchStrategyNumber extends WatchStrategy {
  constructor(session, options) {
    super(session);

    options = _.extend({
      key: [],
      greaterOnly: true,
    }, options);

    this.key = _.castArray(options.key || []);
    this.greaterOnly = options.greaterOnly;
  }

  getNewItems(items) {
    const seenValues = this.session || {};
    return _.filter(items, item => {
      if (this.greaterOnly) {
        return seenValues[item.id] < this._getValue(item);
      }
      return seenValues[item.id] !== this._getValue(item);
    });
  }

  clearNewItems(items) {
    this.session = _.transform(items, (seenValues, item) => {
      seenValues[item.id] = this._getValue(item);
    }, {});
  }

  _getValue(item) {
    return _.sumBy(this.key, key => _.get(item, key) || 0);
  }
}
