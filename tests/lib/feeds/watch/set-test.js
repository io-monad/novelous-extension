import { test } from "../../../common";
import WatchStrategySet from "../../../../app/scripts/lib/feeds/watch/set";

test("#session getter/setter", t => {
  const strategy = new WatchStrategySet;
  strategy.session = { 1: 1 };
  t.same(strategy.session, { 1: 1 });
});

test("#getNewItems filters to new items only", t => {
  const strategy = new WatchStrategySet({ 1: 1, 3: 1 });
  const items = [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }];
  const newItems = strategy.getNewItems(items);

  t.is(newItems.length, 2);
  t.same(newItems, [{ id: "2" }, { id: "4" }]);
});

test("#clearNewItems marks items as seen", t => {
  const strategy = new WatchStrategySet({ 1: 1, 3: 1 });
  const items = [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }];
  t.same(strategy.getNewItems(items), [{ id: "2" }, { id: "4" }]);

  strategy.clearNewItems(items);
  t.same(strategy.getNewItems(items), []);
});
