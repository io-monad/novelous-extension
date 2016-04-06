import { test } from "../../common";
import WatchStrategies from "../../../app/scripts/lib/subscriptions/watch-strategies";
import WatchStrategySet from "../../../app/scripts/lib/subscriptions/watch/set";
import WatchStrategyNumber from "../../../app/scripts/lib/subscriptions/watch/number";

test("#create returns strategy instance", t => {
  const setStrategy = WatchStrategies.create("set");
  const numberStrategy = WatchStrategies.create("number");
  t.true(setStrategy instanceof WatchStrategySet);
  t.true(numberStrategy instanceof WatchStrategyNumber);
});

test("#create throws Error for unknown name", t => {
  t.throws(
    () => { WatchStrategies.create("nonexist"); },
    "Unknown strategy name: nonexist"
  );
});
