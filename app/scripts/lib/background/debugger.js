import _ from "lodash";

export default class Debugger {
  constructor(controller) {
    this.controller = controller;
  }

  testNewItem(itemNum = 1, subIndexes = null) {
    return this._manipulateItems({ itemNum, subIndexes, markNew: true, markUnread: true });
  }

  testUnreadItem(itemNum = 1, subIndexes = null) {
    return this._manipulateItems({ itemNum, subIndexes, markUnread: true });
  }

  _manipulateItems({ itemNum, subIndexes, markNew, markUnread }) {
    const subs = this.controller.subscriber.itemsSubscriptions;
    const items = _.flatMap(subs, (sub, index) => {
      if (subIndexes && subIndexes.indexOf(index) === -1) return [];
      return _.map(sub.items, item => ({ sub, item }));
    });
    const sampled = _.sampleSize(items, itemNum);
    sampled.forEach(({ sub, item }) => {
      if (markUnread) sub._readItemIds.delete(item.id);
      if (markNew) sub._lastFoundItems.push(item);
      sub._clearCache();
    });
    this.controller.subscriber.emit("update");
    return sampled;
  }
}
