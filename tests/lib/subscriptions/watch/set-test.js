import { test } from "../../../common";
import WatchStrategySet from "../../../../app/scripts/lib/subscriptions/watch/set";

test("#filterNewItems", t => {
  const strategy = new WatchStrategySet();
  const items = [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }];
  const state = { 1: 1, 3: 1 };
  const newItems = strategy.filterNewItems(items, state);

  t.deepEqual(newItems, [{ id: "2" }, { id: "4" }]);
});

test("#getAllClearedState", t => {
  const strategy = new WatchStrategySet();
  const items = [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }];
  const state = strategy.getAllClearedState(items);

  t.deepEqual(strategy.filterNewItems(items, state), []);
});

test("#getOneClearedState", t => {
  const strategy = new WatchStrategySet();
  const items = [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }];

  const state1 = strategy.getOneClearedState(items[0], null);
  const state2 = strategy.getOneClearedState(items[2], state1);
  t.true(state1 !== state2);

  const newItems1 = strategy.filterNewItems(items, state1);
  t.deepEqual(newItems1, [{ id: "2" }, { id: "3" }, { id: "4" }]);

  const newItems2 = strategy.filterNewItems(items, state2);
  t.deepEqual(newItems2, [{ id: "2" }, { id: "4" }]);
});
