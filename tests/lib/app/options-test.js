import { test } from "../../common";
import Options from "../../../app/scripts/lib/app/options";

test.beforeEach(t => {
  t.context.options = new Options();
});

test("new Options", t => {
  t.ok(t.context.options instanceof Options);
});

test("#constructor sets default", t => {
  const { options } = t.context;
  t.is(options.updatePeriodMinutes, 15);
  t.true(options.siteSettings.narou);
  t.true(options.siteSettings.kakuyomu);
  t.ok(_.isArray(options.subscriptionSettings));
  t.is(options.subscriptionSettings.length, 4);
});

test("#overwrite updates values with default values", t => {
  const { options } = t.context;
  options.overwrite({
    siteSettings: { narou: false },
  });
  t.false(options.siteSettings.narou);

  options.overwrite({
    siteSettings: { kakuyomu: false },
  });
  t.true(options.siteSettings.narou);
  t.false(options.siteSettings.kakuyomu);
});

test("#overwrite calls setter for each value", t => {
  const { options } = t.context;
  options.overwrite({
    updatePeriodMinutes: "20abc",
  });
  t.is(options.updatePeriodMinutes, 20);
});

test("#schema returns schema", t => {
  const { options } = t.context;
  t.ok(_.isObject(options.schema));
});

test("#updatePeriodMinutes setter converts string into number", t => {
  const { options } = t.context;
  options.updatePeriodMinutes = "20";
  t.is(options.updatePeriodMinutes, 20);
});

test("#updatePeriodMinutes setter uses default for NaN", t => {
  const { options } = t.context;
  options.updatePeriodMinutes = "foobar";
  t.is(options.updatePeriodMinutes, 15);
});

test("#updatePeriodMinutes setter uses default for interval less than minimum", t => {
  const { options } = t.context;
  options.updatePeriodMinutes = 1;
  t.is(options.updatePeriodMinutes, 15);
});

test("#siteSettings returns siteSettings Object", t => {
  const { options } = t.context;
  t.ok(_.isObject(options.siteSettings));
  t.true(options.siteSettings.narou);
});

test("#subscriptionSettings returns array of settings", t => {
  const { options } = t.context;
  t.ok(_.isArray(options.subscriptionSettings));
});

test.serial(".load returns options Promise", t => {
  chrome.storage.local.get.callsArgWithAsync(1, {});
  return Options.load().then((opts) => {
    t.ok(opts instanceof Options);
  });
});

test.serial("#load returns options Promise", t => {
  const { options } = t.context;
  chrome.storage.local.get.callsArgWithAsync(1, {});
  return options.load().then((opts) => {
    t.ok(opts instanceof Options);
  });
});

test.serial("#load emits update event", t => {
  const { options } = t.context;
  chrome.storage.local.get.callsArgWithAsync(1, {});
  t.plan(1);
  options.on("update", (opts) => {
    t.is(opts, options);
  });
  return options.load();
});

test.serial("#save saves values into storage", t => {
  const { options } = t.context;
  chrome.storage.local.set.callsArgAsync(1);
  return options.save().then(() => {
    t.ok(chrome.storage.local.set.called);
    t.pass();
  });
});

test.serial.cb("emits update event for storage change", t => {
  const { options } = t.context;
  t.plan(2);
  options.on("update", (opts) => {
    t.ok(opts instanceof Options);
    t.is(opts.updatePeriodMinutes, 20);
    t.end();
  });
  chrome.storage.onChanged.trigger(
    { updatePeriodMinutes: { newValue: 20 } },
    "sync"
  );
});
