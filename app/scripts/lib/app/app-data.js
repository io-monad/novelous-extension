import EventEmitter from "eventemitter3";
import jsonSchemaDefaults from "json-schema-defaults";
import cutil from "../util/chrome-util";
import appDataSchema from "./app-data-schema.json";
const logger = debug("app-data");

const PROP_KEYS = _.keys(appDataSchema.properties);
const DEFAULTS = jsonSchemaDefaults(appDataSchema);

export default class AppData extends EventEmitter {
  static load(options) {
    return (new AppData(null, options)).load();
  }
  static get schema() {
    return appDataSchema;
  }
  static get defaults() {
    return DEFAULTS;
  }

  constructor(data, options) {
    super();
    options = _.extend({
      saveDelay: 1000,
      autoUpdate: true,
    }, options);

    this.data = {};
    this.changedKeys = {};
    this.savePromise = null;
    this.saveDelay = options.saveDelay;

    if (data) this.overwrite(data);
    this.changedKeys = {};  // Reset changed keys

    if (options.autoUpdate) this._bindStorageEvents();
  }

  overwrite(data) {
    data = _.pick(data, PROP_KEYS);
    data = _.defaults(data, DEFAULTS);
    _.each(data, (v, k) => { this[k] = v; });
  }

  _bindStorageEvents() {
    chrome.storage.onChanged.addListener((changes) => {
      const changedValues = _.mapValues(_.pick(changes, PROP_KEYS), "newValue");
      const changedKeys = _.keys(changedValues);

      if (changedKeys.length > 0) {
        _.extend(this, changedValues);

        logger("Updated by storage change successfully", this.data, changedKeys);
        this.emit("update", this, changedKeys);
      }
    });
  }

  get schema() {
    return appDataSchema;
  }

  get updatePeriodMinutes() {
    return this.data.updatePeriodMinutes;
  }
  set updatePeriodMinutes(minutes) {
    minutes = parseInt(minutes, 10) || DEFAULTS.updatePeriodMinutes;
    if (minutes !== this.data.updatePeriodMinutes) {
      this.data.updatePeriodMinutes = minutes;
      this.changedKeys.updatePeriodMinutes = true;
    }
  }

  get lastUpdatedAt() {
    return this.data.lastUpdatedAt;
  }
  set lastUpdatedAt(time) {
    time = parseInt(time, 10) || null;
    if (time !== this.data.lastUpdatedAt) {
      this.data.lastUpdatedAt = time;
      this.changedKeys.lastUpdatedAt = true;
    }
  }

  get siteSettings() {
    return this.data.siteSettings;
  }
  set siteSettings(siteSettings) {
    siteSettings = _.defaultsDeep(siteSettings, DEFAULTS.siteSettings);
    if (!_.isEqual(siteSettings, this.data.siteSettings)) {
      this.data.siteSettings = siteSettings;
      this.changedKeys.siteSettings = true;
    }
  }

  get subscriptionSettings() {
    return this.data.subscriptionSettings;
  }
  set subscriptionSettings(settings) {
    // Fill missing keys with default values
    settings = (settings || []).concat(DEFAULTS.subscriptionSettings);
    settings = _.uniqBy(settings, "feedUrl");

    if (!_.isEqual(settings, this.data.subscriptionSettings)) {
      this.data.subscriptionSettings = settings;
      this.changedKeys.subscriptionSettings = true;
    }
  }

  load() {
    logger("Loading");
    return cutil.localGet(PROP_KEYS).then((data) => {
      this.overwrite(data);
      logger("Loaded successfully", this.data);

      this.emit("update", this, PROP_KEYS);
      return this;
    });
  }

  save() {
    if (this.savePromise) return this.savePromise;
    if (_.isEmpty(this.changedKeys)) return Promise.resolve(this);

    this.savePromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        const keys = _.keys(this.changedKeys);
        const savedData = _.pick(this.data, keys);

        this.savePromise = null;
        this.changedKeys = {};

        logger("Saving", savedData);
        cutil.localSet(savedData).then(() => {
          logger("Saved successfully", keys, this.data);
          resolve(this);
        })
        .catch(reject);
      }, this.saveDelay);
    });
    return this.savePromise;
  }
}
