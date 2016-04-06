import { test } from "../../../common";
import WatchStrategyNumber from "../../../../app/scripts/lib/feeds/watch/number";

test("#session getter/setter", t => {
  const strategy = new WatchStrategyNumber;
  strategy.session = { 1: 0 };
  t.same(strategy.session, { 1: 0 });
});

test("#getNewItems filters to new items only", t => {
  const strategy = new WatchStrategyNumber({ 1: 0, 2: 0, 3: 1 }, { key: "v" });
  const items = [{ id: "1", v: 2 }, { id: "2", v: 0 }, { id: "3", v: 2 }];
  const newItems = strategy.getNewItems(items);

  t.is(newItems.length, 2);
  t.same(newItems, [items[0], items[2]]);
});

test("with greaterOnly = true", t => {
  const strategy = new WatchStrategyNumber({ 1: 5 }, { key: "v", greaterOnly: true });
  const items = [{ id: "1", v: 4 }];
  t.same(strategy.getNewItems(items), []);
});

test("with greaterOnly = false", t => {
  const strategy = new WatchStrategyNumber({ 1: 5 }, { key: "v", greaterOnly: false });
  const items = [{ id: "1", v: 4 }];
  t.same(strategy.getNewItems(items), items);
});

test("#clearNewItems marks items as seen", t => {
  const strategy = new WatchStrategyNumber({ 1: 0, 2: 0, 3: 1 }, { key: "v" });
  const items = [{ id: "1", v: 2 }, { id: "2", v: 0 }, { id: "3", v: 2 }];
  t.same(strategy.getNewItems(items), [items[0], items[2]]);

  strategy.clearNewItems(items);
  t.same(strategy.getNewItems(items), []);
});
