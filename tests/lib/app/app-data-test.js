import { _, test } from "../../common";
import AppData from "../../../app/scripts/lib/app/app-data";

test.beforeEach(t => {
  t.context.appData = new AppData({});
});

test("new AppData", t => {
  t.truthy(t.context.appData instanceof AppData);
});

test("#overwrite updates values with default values", t => {
  const { appData } = t.context;
  appData.overwrite({
    siteSettings: { narou: false },
  });
  t.false(appData.siteSettings.narou);

  appData.overwrite({
    siteSettings: { kakuyomu: false },
  });
  t.true(appData.siteSettings.narou);
  t.false(appData.siteSettings.kakuyomu);
});

test("#overwrite calls setter for each value", t => {
  const { appData } = t.context;
  appData.overwrite({
    updatePeriodMinutes: "20abc",
  });
  t.is(appData.updatePeriodMinutes, 20);
});

test("#optionsSchema returns JSON schema", t => {
  const { appData } = t.context;
  t.true(_.isObject(appData.optionsSchema));
  t.is(appData.optionsSchema.$schema, "http://json-schema.org/draft-04/schema#");
});

test("#updatePeriodMinutes returns default value", t => {
  const { appData } = t.context;
  t.is(appData.updatePeriodMinutes, AppData.defaults.updatePeriodMinutes);
});

test("#updatePeriodMinutes setter converts string into number", t => {
  const { appData } = t.context;
  appData.updatePeriodMinutes = "20";
  t.is(appData.updatePeriodMinutes, 20);
});

test("#updatePeriodMinutes setter uses default for NaN", t => {
  const { appData } = t.context;
  appData.updatePeriodMinutes = "foobar";
  t.is(appData.updatePeriodMinutes, AppData.defaults.updatePeriodMinutes);
});

test("#lastUpdatedAt setter uses null for NaN", t => {
  const { appData } = t.context;
  appData.lastUpdatedAt = "foobar";
  t.is(appData.lastUpdatedAt, null);
});

test("#siteSettings returns default value", t => {
  const { appData } = t.context;
  t.deepEqual(appData.siteSettings, AppData.defaults.siteSettings);
});

test("#subscriptionSettings returns default value", t => {
  const { appData } = t.context;
  t.deepEqual(appData.subscriptionSettings, AppData.defaults.subscriptionSettings);
});

test("#subscriptionSettings setter keeps defaults", t => {
  const { appData } = t.context;
  appData.subscriptionSettings = [{ feedUrl: "test-feed://test" }];

  t.truthy(_.isArray(appData.subscriptionSettings));
  t.is(appData.subscriptionSettings.length, AppData.defaults.subscriptionSettings.length + 1);
  t.is(appData.subscriptionSettings[0].feedUrl, "test-feed://test");
});

test("#subscriptionSettings setter not duplicating defaults", t => {
  const { appData } = t.context;
  appData.subscriptionSettings = [AppData.defaults.subscriptionSettings[0]];

  t.is(appData.subscriptionSettings.length, AppData.defaults.subscriptionSettings.length);
});

test("#notificationSettings returns default value", t => {
  const { appData } = t.context;
  t.deepEqual(appData.notificationSettings, AppData.defaults.notificationSettings);
});

test("#notificationSettings setter uses default value", t => {
  const { appData } = t.context;
  appData.notificationSettings = { soundEnabled: false };
  t.is(appData.notificationSettings.alertEnabled, true);
  t.is(appData.notificationSettings.soundEnabled, false);
});

test.serial(".load returns appData Promise", t => {
  chrome.storage.local.get.callsArgWithAsync(1, {});
  return AppData.load().then((opts) => {
    t.truthy(opts instanceof AppData);
  });
});

test.serial("#load returns appData Promise", t => {
  const { appData } = t.context;
  chrome.storage.local.get.callsArgWithAsync(1, {});
  return appData.load().then((opts) => {
    t.truthy(opts instanceof AppData);
  });
});

test.serial("#load emits update event", t => {
  const { appData } = t.context;
  const propKeys = _.clone(AppData.keys);
  chrome.storage.local.get.callsArgWithAsync(1, {});
  t.plan(2);
  appData.on("update", (opts, keys) => {
    t.is(opts, appData);
    t.deepEqual(keys.sort(), propKeys.sort());
  });
  return appData.load();
});

test.serial("#save saves nothing when nothing updated", t => {
  const { appData } = t.context;
  return appData.save().then(() => {
    t.false(chrome.storage.local.set.called);
  });
});

test.serial("#save saves only changed values into storage", t => {
  const { appData } = t.context;
  chrome.storage.local.set.callsArgAsync(1);
  appData.updatePeriodMinutes = 60;
  appData.lastUpdatedAt = 1234567890;
  return appData.save().then(() => {
    t.true(chrome.storage.local.set.calledOnce);
    t.deepEqual(chrome.storage.local.set.args[0][0], {
      updatePeriodMinutes: 60,
      lastUpdatedAt: 1234567890,
    });
  });
});

test.serial.cb("emits update event for storage change", t => {
  const { appData } = t.context;
  t.plan(3);
  appData.on("update", (opts, keys) => {
    t.truthy(opts instanceof AppData);
    t.is(opts.updatePeriodMinutes, 20);
    t.deepEqual(keys, ["updatePeriodMinutes"]);
    t.end();
  });
  chrome.storage.onChanged.trigger(
    { updatePeriodMinutes: { newValue: 20 } },
    "local"
  );
});

test.serial("does not update for storage change if autoUpdate = false", t => {
  const appData = new AppData({}, { autoUpdate: false });
  appData.on("update", t.fail);
  chrome.storage.onChanged.trigger(
    { updatePeriodMinutes: { newValue: 20 } },
    "local"
  );
});

test.serial.cb("uses default value if storage value is undefined", t => {
  const { appData } = t.context;
  t.plan(4);
  appData.on("update", (opts, keys) => {
    t.truthy(opts instanceof AppData);
    t.is(opts.updatePeriodMinutes, AppData.defaults.updatePeriodMinutes);
    t.truthy(_.isObject(opts.siteSettings));
    t.deepEqual(keys.sort(), ["siteSettings", "updatePeriodMinutes"]);
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
