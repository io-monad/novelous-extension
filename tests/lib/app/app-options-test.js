import { test } from "../../common";
import jsonSchemaDefaults from "json-schema-defaults";
import AppOptions from "../../../app/scripts/lib/app/app-options";
import appOptionsSchema from "../../../app/scripts/lib/app/app-options-schema.json";
import Site from "../../../app/scripts/lib/sites/site";
import Subscription from "../../../app/scripts/lib/subscriptions/subscription";

const DEFAULT_OPTIONS = jsonSchemaDefaults(appOptionsSchema);

test.beforeEach(t => {
  t.context.options = new AppOptions();
});

test("new AppOptions", t => {
  t.ok(t.context.options instanceof AppOptions);
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
  t.same(options.schema, appOptionsSchema);
});

test("#updatePeriodMinutes returns default value", t => {
  const { options } = t.context;
  t.is(options.updatePeriodMinutes, DEFAULT_OPTIONS.updatePeriodMinutes);
});

test("#updatePeriodMinutes setter converts string into number", t => {
  const { options } = t.context;
  options.updatePeriodMinutes = "20";
  t.is(options.updatePeriodMinutes, 20);
});

test("#updatePeriodMinutes setter uses default for NaN", t => {
  const { options } = t.context;
  options.updatePeriodMinutes = "foobar";
  t.is(options.updatePeriodMinutes, DEFAULT_OPTIONS.updatePeriodMinutes);
});

test("#updatePeriodMinutes setter uses default for interval less than minimum", t => {
  const { options } = t.context;
  options.updatePeriodMinutes = 1;
  t.is(options.updatePeriodMinutes, DEFAULT_OPTIONS.updatePeriodMinutes);
});

test("#siteSettings returns default value", t => {
  const { options } = t.context;
  t.same(options.siteSettings, DEFAULT_OPTIONS.siteSettings);
});

test("#sites returns a map of Site", t => {
  const { options } = t.context;
  t.ok(_.isObject(options.sites));
  t.ok(_.every(options.sites, site => site instanceof Site));
  t.is(_.size(options.sites), _.size(DEFAULT_OPTIONS.siteSettings));
});

test("#subscriptionSettings returns default value", t => {
  const { options } = t.context;
  t.same(options.subscriptionSettings, DEFAULT_OPTIONS.subscriptionSettings);
});

test("#subscriptions returns array of Subscription", t => {
  const { options } = t.context;
  t.ok(_.isArray(options.subscriptions));
  t.ok(_.every(options.subscriptions, sub => sub instanceof Subscription));
  t.is(options.subscriptions.length, DEFAULT_OPTIONS.subscriptionSettings.length);
});

test("#subscriptions setter updates subscriptionSettings but keeps defaults", t => {
  const { options } = t.context;
  const newSub = new Subscription({ siteName: "test", itemType: "foo" });
  options.subscriptions = [newSub];
  t.ok(_.isArray(options.subscriptions));
  t.ok(_.every(options.subscriptions, sub => sub instanceof Subscription));
  t.is(options.subscriptions.length, DEFAULT_OPTIONS.subscriptionSettings.length + 1);
  t.same(options.subscriptions[0], newSub);
});

test("#subscriptions setter not duplicating defaults", t => {
  const { options } = t.context;
  const newSub = new Subscription({ siteName: "narou", itemType: "myNovels" });
  options.subscriptions = [newSub];
  t.is(options.subscriptions.length, DEFAULT_OPTIONS.subscriptionSettings.length);
});

test.serial(".load returns options Promise", t => {
  chrome.storage.local.get.callsArgWithAsync(1, {});
  return AppOptions.load().then((opts) => {
    t.ok(opts instanceof AppOptions);
  });
});

test.serial("#load returns options Promise", t => {
  const { options } = t.context;
  chrome.storage.local.get.callsArgWithAsync(1, {});
  return options.load().then((opts) => {
    t.ok(opts instanceof AppOptions);
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
    t.ok(opts instanceof AppOptions);
    t.is(opts.updatePeriodMinutes, 20);
    t.end();
  });
  chrome.storage.onChanged.trigger(
    { updatePeriodMinutes: { newValue: 20 } },
    "local"
  );
});

test.serial.cb("uses default value if storage value is undefined", t => {
  const { options } = t.context;
  t.plan(3);
  options.on("update", (opts) => {
    t.ok(opts instanceof AppOptions);
    t.is(opts.updatePeriodMinutes, 15);
    t.ok(_.isObject(opts.siteSettings));
    t.end();
  });
  chrome.storage.onChanged.trigger(
    {
      updatePeriodMinutes: { newValue: undefined },
      siteSettings: { newValue: undefined },
    },
    "local"
  );
});
