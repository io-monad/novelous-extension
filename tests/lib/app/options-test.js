import { test } from "../../common";
import Options from "../../../app/scripts/lib/app/options";

let options;

test.beforeEach(() => {
  options = new Options();
});

test("new Options", t => {
  t.ok(options instanceof Options);
});

test("#constructor sets default", t => {
  t.is(options.updatePeriodMinutes, 15);
  t.true(options.siteSettings.narou);
  t.true(options.siteSettings.kakuyomu);
});

test("#overwrite updates values with default values", t => {
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
  options.overwrite({
    updatePeriodMinutes: "20abc",
  });
  t.is(options.updatePeriodMinutes, 20);
});

test("#schema returns schema", t => {
  t.ok(_.isObject(options.schema));
});

test("#updatePeriodMinutes setter converts string into number", t => {
  options.updatePeriodMinutes = "20";
  t.is(options.updatePeriodMinutes, 20);
});

test("#updatePeriodMinutes setter uses default for NaN", t => {
  options.updatePeriodMinutes = "foobar";
  t.is(options.updatePeriodMinutes, 15);
});

test("#updatePeriodMinutes setter uses default for interval less than minimum", t => {
  options.updatePeriodMinutes = 1;
  t.is(options.updatePeriodMinutes, 15);
});

test("#siteSettings returns siteSettings Object", t => {
  t.ok(_.isObject(options.siteSettings));
  t.true(options.siteSettings.narou);
});

test("#subscriptionSettings returns array of settings", t => {
  t.ok(_.isArray(options.subscriptionSettings));
});

test(".load returns options Promise", t => {
  chrome.storage.sync.get.callsArgWithAsync(1, {});
  return Options.load().then((opts) => {
    t.ok(opts instanceof Options);
  });
});

test("#load returns options Promise", t => {
  chrome.storage.sync.get.callsArgWithAsync(1, {});
  return options.load().then((opts) => {
    t.ok(opts instanceof Options);
  });
});

test.serial("#save saves values into storage", t => {
  chrome.storage.sync.set.callsArgAsync(1);
  return options.save().then(() => {
    t.ok(chrome.storage.sync.set.called);
    t.pass();
  });
});

test.cb("#observeUpdate registers listener", t => {
  t.plan(1);
  options.observeUpdate((opts) => {
    t.ok(opts instanceof Options);
    t.end();
  });
  chrome.storage.onChanged.trigger({ options: {} }, "sync");
});
