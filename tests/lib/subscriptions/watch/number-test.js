import { test } from "../../../common";
import WatchStrategyNumber from "../../../../app/scripts/lib/subscriptions/watch/number";

test("#filterNewItems", t => {
  const strategy = new WatchStrategyNumber({ key: "v" });
  const items = [{ id: "1", v: 2 }, { id: "2", v: 0 }, { id: "3", v: 2 }];
  const state = { 1: 0, 2: 0, 3: 1 };
  const newItems = strategy.filterNewItems(items, state);

  t.deepEqual(newItems, [items[0], items[2]]);
});

test("with greaterOnly = true", t => {
  const strategy = new WatchStrategyNumber({ key: "v", greaterOnly: true });
  const items = [{ id: "1", v: 4 }];
  const state = { 1: 5 };

  t.deepEqual(strategy.filterNewItems(items, state), []);
});

test("with greaterOnly = false", t => {
  const strategy = new WatchStrategyNumber({ key: "v", greaterOnly: false });
  const items = [{ id: "1", v: 4 }];
  const state = { 1: 5 };

  t.deepEqual(strategy.filterNewItems(items, state), items);
});

test("#getAllClearedState", t => {
  const strategy = new WatchStrategyNumber({ 1: 0, 2: 0, 3: 1 }, { key: "v" });
  const items = [{ id: "1", v: 2 }, { id: "2", v: 0 }, { id: "3", v: 2 }];
  const state = strategy.getAllClearedState(items);

  t.deepEqual(strategy.filterNewItems(items, state), []);
});

test("#getOneClearedState", t => {
  const strategy = new WatchStrategyNumber({ key: "v" });
  const items = [{ id: "1", v: 2 }, { id: "2", v: 0 }, { id: "3", v: 2 }];

  const state1 = strategy.getOneClearedState(items[0], null);
  const state2 = strategy.getOneClearedState(items[2], state1);
  t.true(state1 !== state2);

  const newItems1 = strategy.filterNewItems(items, state1);
  t.deepEqual(newItems1, [{ id: "2", v: 0 }, { id: "3", v: 2 }]);

  const newItems2 = strategy.filterNewItems(items, state2);
  t.deepEqual(newItems2, [{ id: "2", v: 0 }]);
});
