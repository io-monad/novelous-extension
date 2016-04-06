/**
 * Watch strategy that detects updates by changing numertic property.
 *
 * @implements WatchStrategy
 */
export default class WatchStrategyNumber {
  /**
   * @param {Object} [options] - Options.
   * @param {string|string[]} [options.key]
   *     A key or keys of property to be observed.
   * @param {boolean} [options.greaterOnly]
   *     When `true`, treat items as new items only if the property value
   *     becomes greater than old value.
   */
  constructor(options) {
    options = _.extend({
      key: [],
      greaterOnly: true,
    }, options);

    this.key = _.castArray(options.key || []);
    this.greaterOnly = options.greaterOnly;
  }

  filterNewItems(items, state) {
    if (!state) return _.clone(items);
    return _.filter(items, item => {
      if (this.greaterOnly) {
        return state[item.id] < this._getValue(item);
      }
      return state[item.id] !== this._getValue(item);
    });
  }

  getClearedState(items) {
    return _.transform(items, (state, item) => {
      state[item.id] = this._getValue(item);
    }, {});
  }

  _getValue(item) {
    return _.sumBy(this.key, key => _.get(item, key) || 0);
  }
}
