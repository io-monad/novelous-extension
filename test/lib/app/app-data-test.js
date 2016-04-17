import { _, assert } from "../../common";
import AppData from "../../../app/scripts/lib/app/app-data";

describe("AppData", () => {
  let appData;

  beforeEach(() => {
    appData = new AppData({});
  });

  it("new AppData", () => {
    assert(appData instanceof AppData);
  });

  describe("#overwrite", () => {
    it("updates values with default values", () => {
      appData.overwrite({
        updatePeriodMinutes: 60,
      });
      assert(appData.updatePeriodMinutes === 60);

      appData.overwrite({
        notificationSettings: { alertEnabled: false },
      });
      assert(appData.updatePeriodMinutes === AppData.defaults.updatePeriodMinutes);
      assert(appData.notificationSettings.alertEnabled === false);
    });

    it("calls setter for each value", () => {
      appData.overwrite({
        updatePeriodMinutes: "30abc",
      });
      assert(appData.updatePeriodMinutes === 30);
    });
  });

  describe("#optionsSchema", () => {
    it("returns JSON schema", () => {
      assert(_.isObject(appData.optionsSchema));
      assert(appData.optionsSchema.$schema === "http://json-schema.org/draft-04/schema#");
    });
  });

  describe("#updatePeriodMinutes", () => {
    it("getter returns default value", () => {
      assert(appData.updatePeriodMinutes === AppData.defaults.updatePeriodMinutes);
    });

    it("setter converts string into number", () => {
      appData.updatePeriodMinutes = "20";
      assert(appData.updatePeriodMinutes === 20);
    });

    it("setter uses default for NaN", () => {
      appData.updatePeriodMinutes = "foobar";
      assert(appData.updatePeriodMinutes === AppData.defaults.updatePeriodMinutes);
    });
  });

  describe("#lastUpdatedAt", () => {
    it("setter uses null for NaN", () => {
      appData.lastUpdatedAt = "foobar";
      assert(appData.lastUpdatedAt === null);
    });
  });

  describe("#subscriptionSettings", () => {
    it("getter returns default value", () => {
      assert.deepEqual(appData.subscriptionSettings, AppData.defaults.subscriptionSettings);
    });

    it("setter keeps defaults", () => {
      appData.subscriptionSettings = [{ feedUrl: "test-feed://test" }];

      assert(_.isArray(appData.subscriptionSettings));
      assert(appData.subscriptionSettings.length ===
        AppData.defaults.subscriptionSettings.length + 1);
      assert(appData.subscriptionSettings[0].feedUrl === "test-feed://test");
    });

    it("setter not duplicating defaults", () => {
      appData.subscriptionSettings = [AppData.defaults.subscriptionSettings[0]];

      assert(appData.subscriptionSettings.length === AppData.defaults.subscriptionSettings.length);
    });
  });

  describe("#notificationSettings", () => {
    it("getter returns default value", () => {
      assert.deepEqual(appData.notificationSettings, AppData.defaults.notificationSettings);
    });

    it("setter uses default value", () => {
      appData.notificationSettings = { soundEnabled: false };
      assert(appData.notificationSettings.alertEnabled === true);
      assert(appData.notificationSettings.soundEnabled === false);
    });
  });

  describe(".load", () => {
    it("returns appData Promise", () => {
      chrome.storage.local.get.callsArgWithAsync(1, {});
      return AppData.load().then((opts) => {
        assert(opts instanceof AppData);
      });
    });
  });

  describe("#load", () => {
    it("returns appData Promise", () => {
      chrome.storage.local.get.callsArgWithAsync(1, {});
      return appData.load().then((opts) => {
        assert(opts instanceof AppData);
      });
    });

    it("emits update event", (done) => {
      const propKeys = _.clone(AppData.keys);
      chrome.storage.local.get.callsArgWithAsync(1, {});
      appData.on("update", (opts, keys) => {
        assert(opts === appData);
        assert.deepEqual(keys.sort(), propKeys.sort());
        done();
      });
      appData.load();
    });
  });

  describe("#save", () => {
    it("saves nothing when nothing updated", () => {
      return appData.save().then(() => {
        assert(!chrome.storage.local.set.called);
      });
    });

    it("saves only changed values into storage", () => {
      chrome.storage.local.set.callsArgAsync(1);
      appData.updatePeriodMinutes = 60;
      appData.lastUpdatedAt = 1234567890;
      return appData.save().then(() => {
        assert(chrome.storage.local.set.calledOnce);
        assert.deepEqual(chrome.storage.local.set.args[0][0], {
          updatePeriodMinutes: 60,
          lastUpdatedAt: 1234567890,
        });
      });
    });
  });

  describe("update event", () => {
    it("is emitted for storage change", (done) => {
      appData.on("update", (opts, keys) => {
        assert(opts instanceof AppData);
        assert(opts.updatePeriodMinutes === 20);
        assert.deepEqual(keys, ["updatePeriodMinutes"]);
        done();
      });
      chrome.storage.onChanged.trigger(
        { updatePeriodMinutes: { newValue: 20 } },
        "local"
      );
    });

    it("is not emitted for storage change if autoUpdate = false", () => {
      const appDataNoUpdate = new AppData({}, { autoUpdate: false });
      appDataNoUpdate.on("update", () => {
        assert(false, "update emitted");
      });
      chrome.storage.onChanged.trigger(
        { updatePeriodMinutes: { newValue: 20 } },
        "local"
      );
    });

    it("uses default value if storage value is undefined", (done) => {
      appData.on("update", (opts, keys) => {
        assert(opts instanceof AppData);
        assert(opts.updatePeriodMinutes === AppData.defaults.updatePeriodMinutes);
        assert(_.isObject(opts.notificationSettings));
        assert.deepEqual(keys.sort(), ["notificationSettings", "updatePeriodMinutes"]);
        done();
      });
      chrome.storage.onChanged.trigger(
        {
          updatePeriodMinutes: { newValue: undefined },
          notificationSettings: { newValue: undefined },
        },
        "local"
      );
    });
  });
});
