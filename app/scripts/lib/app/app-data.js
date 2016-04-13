import _ from "lodash";
import EventEmitter from "eventemitter3";
import jsonSchemaDefaults from "json-schema-defaults";
import cutil from "../util/chrome-util";
import appOptionsSchema from "./app-options-schema.json";
const logger = debug("app-data");

const DEFAULTS = _.extend(jsonSchemaDefaults(appOptionsSchema), {
  lastUpdatedAt: null,
  subscriptionSettings: [
    { type: "stats", feedUrl: "novelous-feed://narou/novels" },
    { type: "items", feedUrl: "novelous-feed://narou/messages" },
    { type: "items", feedUrl: "novelous-feed://narou/comments" },
    { type: "items", feedUrl: "novelous-feed://narou/blog-comments" },
    { type: "items", feedUrl: "novelous-feed://narou/reviews" },
    { type: "items", feedUrl: "novelous-feed://kakuyomu/reviews" },
  ],
});
const PROP_KEYS = _.keys(DEFAULTS);
const OPTION_KEYS = _.keys(appOptionsSchema.properties);

export default class AppData extends EventEmitter {
  static load(options) {
    return (new AppData(null, options)).load();
  }
  static get optionsSchema() {
    return appOptionsSchema;
  }
  static get defaults() {
    return DEFAULTS;
  }
  static get keys() {
    return PROP_KEYS;
  }

  constructor(data, options) {
    super();
    options = _.extend({
      autoUpdate: true,
    }, options);

    this.data = {};
    this.changedKeys = {};

    if (data) this.overwrite(data);
    this.changedKeys = {};  // Reset changed keys

    if (options.autoUpdate) this._bindStorageEvents();
  }

  overwrite(data) {
    data = _.pick(data, PROP_KEYS);
    data = _.defaults(data, DEFAULTS);
    _.each(data, (v, k) => { this[k] = v; });
  }

  getOptions() {
    return _.cloneDeep(_.pick(this.data, OPTION_KEYS));
  }
  setOptions(options) {
    options = _.pick(options, OPTION_KEYS);
    _.each(options, (v, k) => { this[k] = v; });
  }

  load() {
    logger("Loading");
    return cutil.localGet(PROP_KEYS).then((data) => {
      this.overwrite(data);
      this.changedKeys = {};  // Reset changed keys
      logger("Loaded successfully", this.data);

      this.emit("update", this, PROP_KEYS);
      return this;
    });
  }

  save() {
    if (_.isEmpty(this.changedKeys)) return Promise.resolve(this);

    const keys = _.keys(this.changedKeys);
    const savedData = _.pick(this.data, keys);
    this.changedKeys = {};

    logger("Saving", savedData);
    return cutil.localSet(savedData).then(() => {
      logger("Saved successfully", keys, this.data);
      return this;
    });
  }

  _bindStorageEvents() {
    chrome.storage.onChanged.addListener((changes) => {
      const changedValues = _.mapValues(_.pick(changes, PROP_KEYS), "newValue");
      const changedKeys = _.keys(changedValues);

      if (changedKeys.length > 0) {
        _.extend(this, changedValues);
        this.changedKeys = _.omit(this.changedKeys, changedKeys);

        logger("Updated by storage change successfully", this.data, changedKeys);
        this.emit("update", this, changedKeys);
      }
    });
  }

  _setData(key, value) {
    if (!_.isEqual(this.data[key], value)) {
      this.data[key] = value;
      this.changedKeys[key] = true;
    }
  }

  get optionsSchema() {
    return appOptionsSchema;
  }

  get updatePeriodMinutes() {
    return this.data.updatePeriodMinutes;
  }
  set updatePeriodMinutes(minutes) {
    minutes = parseInt(minutes, 10) || DEFAULTS.updatePeriodMinutes;
    this._setData("updatePeriodMinutes", minutes);
  }

  get lastUpdatedAt() {
    return this.data.lastUpdatedAt;
  }
  set lastUpdatedAt(time) {
    time = parseInt(time, 10) || null;
    this._setData("lastUpdatedAt", time);
  }

  get subscriptionSettings() {
    return this.data.subscriptionSettings;
  }
  set subscriptionSettings(settings) {
    // Fill missing keys with default values
    settings = (settings || []).concat(DEFAULTS.subscriptionSettings);
    settings = _.uniqWith(settings, (a, b) => a.type === b.type && a.feedUrl === b.feedUrl);
    this._setData("subscriptionSettings", settings);
  }

  get notificationSettings() {
    return this.data.notificationSettings;
  }
  set notificationSettings(settings) {
    settings = _.defaults(settings, DEFAULTS.notificationSettings);
    this._setData("notificationSettings", settings);
  }
}
