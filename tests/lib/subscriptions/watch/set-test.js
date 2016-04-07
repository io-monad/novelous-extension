import { test } from "../../../common";
import WatchStrategySet from "../../../../app/scripts/lib/subscriptions/watch/set";

test("#filterNewItems", t => {
  const strategy = new WatchStrategySet();
  const items = [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }];
  const state = { 1: 1, 3: 1 };
  const newItems = strategy.filterNewItems(items, state);

  t.deepEqual(newItems, [{ id: "2" }, { id: "4" }]);
});

test("#getClearedState", t => {
  const strategy = new WatchStrategySet();
  const items = [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }];
  const state = strategy.getClearedState(items);

  t.deepEqual(strategy.filterNewItems(items, state), []);
});
