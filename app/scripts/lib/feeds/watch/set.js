import WatchStrategy from "./base";

export default class WatchStrategySet extends WatchStrategy {
  constructor(session, options) {
    super(session);
    this.key = options && options.key || "id";
  }

  getNewItems(items) {
    const seenIds = this.session || {};
    return _.reject(items, item => seenIds[_.get(item, this.key)]);
  }

  clearNewItems(items) {
    this.session = _.transform(items, (seenIds, item) => {
      const id = _.get(item, this.key);
      if (_.isString(id) || _.isNumber(id)) seenIds[id] = 1;
    }, {});
  }
}
