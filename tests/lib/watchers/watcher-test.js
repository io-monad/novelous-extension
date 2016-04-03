import { test } from "../../common";
import Watcher from "../../../app/scripts/lib/watchers/watcher";

test.beforeEach(t => {
  t.context.settings = [
    { id: "w1", valueType: "number", valueKey: "*.a" },
    { id: "w2", valueType: "any", valueKey: "*.b" },
  ];
  t.context.watcher = new Watcher(t.context.settings);
});

test("new Watcher", t => {
  t.ok(t.context.watcher instanceof Watcher);
});

test("#getSettingById", t => {
  const { watcher, settings } = t.context;
  t.is(watcher.getSettingById("w1"), settings[0]);
  t.is(watcher.getSettingById("w2"), settings[1]);
  t.ok(_.isUndefined(watcher.getSettingById("unknown")));
});

test("#notifyUpdate on first just sets seen value", t => {
  const { watcher } = t.context;
  watcher.on("update", t.fail);
  const updated = watcher.notifyUpdate("w1", { foo: { a: 1 }, bar: { a: 2 } });
  t.false(updated);

  const updatedSetting = watcher.getSettingById("w1");
  t.is(updatedSetting.seenValue, 3);
  t.is(updatedSetting.lastValue, 3);
});

test.cb("#notifyUpdate emits `update` for new value", t => {
  const { watcher } = t.context;
  const target1 = { foo: { a: 1 }, bar: { a: 2 } };
  const target2 = { foo: { a: 2 }, bar: { a: 3 } };
  watcher.notifyUpdate("w1", target1);

  watcher.on("update", (data) => {
    const updatedSetting = watcher.getSettingById("w1");
    t.is(updatedSetting.seenValue, 3);
    t.is(updatedSetting.lastValue, 5);

    t.is(data.id, "w1");
    t.is(data.target, target2);
    t.is(data.setting, updatedSetting);
    t.same(data.rawValue, [2, 3]);
    t.is(data.newValue, 5);
    t.is(data.oldValue, 3);
    t.is(data.count, 2);

    t.end();
  });

  const updated = watcher.notifyUpdate("w1", target2);
  t.true(updated);
});

test("#notifyUpdate never emit `update` for same value", t => {
  const { watcher } = t.context;
  const target1 = { foo: { a: 1 }, bar: { a: 2 } };
  const target2 = { foo: { a: 1 }, bar: { a: 2 } };
  watcher.notifyUpdate("w1", target1);
  watcher.on("update", t.fail);

  const updated = watcher.notifyUpdate("w1", target2);
  t.false(updated);

  const updatedSetting = watcher.getSettingById("w1");
  t.is(updatedSetting.seenValue, 3);
  t.is(updatedSetting.lastValue, 3);
});

test.cb("#notifyUpdate chooses value type based on setting", t => {
  const { watcher } = t.context;
  const target1 = [{ b: 1 }];
  const target2 = [{ b: 1 }, { b: 2 }, { b: 3 }];
  watcher.notifyUpdate("w2", target1);

  watcher.on("update", (data) => {
    const updatedSetting = watcher.getSettingById("w2");
    t.same(updatedSetting.seenValue, [1]);
    t.same(updatedSetting.lastValue, [1, 2, 3]);

    t.is(data.id, "w2");
    t.is(data.target, target2);
    t.is(data.setting, updatedSetting);
    t.same(data.rawValue, [1, 2, 3]);
    t.same(data.newValue, [1, 2, 3]);
    t.same(data.oldValue, [1]);
    t.is(data.count, 2);

    t.end();
  });

  const updated = watcher.notifyUpdate("w2", target2);
  t.true(updated);
});

test("#notifyUpdate skips target without setting", t => {
  const { watcher } = t.context;
  watcher.on("update", t.fail);
  const updated = watcher.notifyUpdate("unknown", { foo: { a: 1 }, bar: { a: 2 } });
  t.false(updated);
});

test("#markAsSeen sets seenValue of all settings", t => {
  const { watcher } = t.context;
  watcher.notifyUpdate("w1", { foo: { a: 1 } });
  watcher.notifyUpdate("w2", [{ b: 1 }]);

  watcher.notifyUpdate("w1", { foo: { a: 3 } });
  watcher.notifyUpdate("w2", [{ b: 1 }, { b: 2 }]);

  const w1 = watcher.getSettingById("w1");
  const w2 = watcher.getSettingById("w2");

  t.same(w1.seenValue, 1);
  t.same(w1.lastValue, 3);
  t.same(w2.seenValue, [1]);
  t.same(w2.lastValue, [1, 2]);

  watcher.markAsSeen();

  t.same(w1.seenValue, 3);
  t.same(w2.seenValue, [1, 2]);
});

test.cb("#markAsSeen emits `seen` event", t => {
  const { watcher } = t.context;
  watcher.on("seen", t.end);
  watcher.markAsSeen();
});
