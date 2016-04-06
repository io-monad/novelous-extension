import { test, factory, sinonsb } from "../../common";
import jsonSchemaDefaults from "json-schema-defaults";
import AppData from "../../../app/scripts/lib/app/app-data";
import appDataSchema from "../../../app/scripts/lib/app/app-data-schema.json";
import Site from "../../../app/scripts/lib/sites/site";
import Subscription from "../../../app/scripts/lib/subscriptions/subscription";
import FeedFactory from "../../../app/scripts/lib/feeds/feed-factory";
import NarouMessagesFeed from "../../../app/scripts/lib/feeds/narou-messages";

const PROP_KEYS = _.keys(appDataSchema.properties);
const DEFAULTS = jsonSchemaDefaults(appDataSchema);

test.beforeEach(t => {
  t.context.appData = new AppData();
});

test("new AppData", t => {
  t.ok(t.context.appData instanceof AppData);
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

test("#schema returns schema", t => {
  const { appData } = t.context;
  t.same(appData.schema, appDataSchema);
});

test("#updatePeriodMinutes returns default value", t => {
  const { appData } = t.context;
  t.is(appData.updatePeriodMinutes, DEFAULTS.updatePeriodMinutes);
});

test("#updatePeriodMinutes setter converts string into number", t => {
  const { appData } = t.context;
  appData.updatePeriodMinutes = "20";
  t.is(appData.updatePeriodMinutes, 20);
});

test("#updatePeriodMinutes setter uses default for NaN", t => {
  const { appData } = t.context;
  appData.updatePeriodMinutes = "foobar";
  t.is(appData.updatePeriodMinutes, DEFAULTS.updatePeriodMinutes);
});

test("#updatePeriodMinutes setter uses default for interval less than minimum", t => {
  const { appData } = t.context;
  appData.updatePeriodMinutes = 1;
  t.is(appData.updatePeriodMinutes, DEFAULTS.updatePeriodMinutes);
});

test("#siteSettings returns default value", t => {
  const { appData } = t.context;
  t.same(appData.siteSettings, DEFAULTS.siteSettings);
});

test("#sites returns a map of Site", t => {
  const { appData } = t.context;
  t.ok(_.isObject(appData.sites));
  t.ok(_.every(appData.sites, site => site instanceof Site));
  t.is(_.size(appData.sites), _.size(DEFAULTS.siteSettings));
});

test("#subscriptionSettings returns default value", t => {
  const { appData } = t.context;
  t.same(appData.subscriptionSettings, DEFAULTS.subscriptionSettings);
});

test("#subscriptions returns array of Subscription", t => {
  const { appData } = t.context;
  t.ok(_.isArray(appData.subscriptions));
  t.ok(_.every(appData.subscriptions, sub => sub instanceof Subscription));
  t.is(appData.subscriptions.length, DEFAULTS.subscriptionSettings.length);
});

test("#subscriptions setter updates subscriptionSettings but keeps defaults", t => {
  const { appData } = t.context;
  sinonsb.stub(FeedFactory, "create").returns(new NarouMessagesFeed);
  const newSub = new Subscription({ feedName: "test-feed" });
  appData.subscriptions = [newSub];

  t.ok(_.isArray(appData.subscriptions));
  t.ok(_.every(appData.subscriptions, sub => sub instanceof Subscription));
  t.is(appData.subscriptions.length, DEFAULTS.subscriptionSettings.length + 1);
  t.is(appData.subscriptions[0].id, newSub.id);
});

test("#subscriptions setter not duplicating defaults", t => {
  const { appData } = t.context;
  const newSub = new Subscription(DEFAULTS.subscriptionSettings[0]);
  appData.subscriptions = [newSub];
  t.is(appData.subscriptions.length, DEFAULTS.subscriptionSettings.length);
});

test.serial(".load returns appData Promise", t => {
  chrome.storage.local.get.callsArgWithAsync(1, {});
  return AppData.load().then((opts) => {
    t.ok(opts instanceof AppData);
  });
});

test.serial("#load returns appData Promise", t => {
  const { appData } = t.context;
  chrome.storage.local.get.callsArgWithAsync(1, {});
  return appData.load().then((opts) => {
    t.ok(opts instanceof AppData);
  });
});

test.serial("#load emits update event", t => {
  const { appData } = t.context;
  chrome.storage.local.get.callsArgWithAsync(1, {});
  t.plan(2);
  appData.on("update", (opts, keys) => {
    t.is(opts, appData);
    t.same(keys.sort(), PROP_KEYS.concat(["subscriptions", "sites"]).sort());
  });
  return appData.load();
});

test.serial("#save saves values into storage", t => {
  const { appData } = t.context;
  chrome.storage.local.set.callsArgAsync(1);
  return appData.save().then(() => {
    t.ok(chrome.storage.local.set.called);
    t.same(chrome.storage.local.set.args[0][0], appData.data);
    t.pass();
  });
});

test.serial("#save accepts keys to filter saved values", t => {
  const { appData } = t.context;
  chrome.storage.local.set.callsArgAsync(1);
  return appData.save(["updatePeriodMinutes", "subscriptions"]).then(() => {
    t.ok(chrome.storage.local.set.called);
    t.same(chrome.storage.local.set.args[0][0], {
      updatePeriodMinutes: appData.updatePeriodMinutes,
      subscriptionSettings: appData.subscriptionSettings,
    });
    t.pass();
  });
});

test.serial.cb("emits update event for storage change", t => {
  const { appData } = t.context;
  t.plan(3);
  appData.on("update", (opts, keys) => {
    t.ok(opts instanceof AppData);
    t.is(opts.updatePeriodMinutes, 20);
    t.same(keys, ["updatePeriodMinutes"]);
    t.end();
  });
  chrome.storage.onChanged.trigger(
    { updatePeriodMinutes: { newValue: 20 } },
    "local"
  );
});

test.serial.cb("uses default value if storage value is undefined", t => {
  const { appData } = t.context;
  t.plan(4);
  appData.on("update", (opts, keys) => {
    t.ok(opts instanceof AppData);
    t.is(opts.updatePeriodMinutes, DEFAULTS.updatePeriodMinutes);
    t.ok(_.isObject(opts.siteSettings));
    t.same(keys, ["updatePeriodMinutes", "siteSettings", "sites"]);
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
