import _ from "lodash";

/**
 * Watch strategy that detects updates by unique property like `id`.
 *
 * @implements WatchStrategy
 */
export default class WatchStrategySet {
  /**
   * @param {Object} [options] - Options.
   * @param {string} [options.key="id"]
   *     A key of unique property used to identify items.
   */
  constructor(options) {
    this.key = options && options.key || "id";
  }

  filterNewItems(items, state) {
    state = state || {};
    return _.reject(items, item => {
      const id = this._getId(item);
      if (_.isString(id) || _.isNumber(id)) return state[id];
      return true; // Invalid ID items should always be filtered.
    });
  }

  getAllClearedState(items) {
    return _.transform(items, (state, item) => {
      const id = this._getId(item);
      if (_.isString(id) || _.isNumber(id)) state[id] = 1;
    }, {});
  }

  getOneClearedState(item, prevState) {
    const state = prevState ? _.clone(prevState) : {};
    const id = this._getId(item);
    if (_.isString(id) || _.isNumber(id)) state[id] = 1;
    return state;
  }

  _getId(item) {
    return _.get(item, this.key);
  }
}
