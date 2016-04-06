import EventEmitter from "eventemitter3";
import jsonSchemaDefaults from "json-schema-defaults";
import cutil from "../util/chrome-util";
import appDataSchema from "./app-data-schema.json";
import SiteFactory from "../sites/site-factory";
import Subscription from "../subscriptions/subscription";
const logger = debug("app-data");

const PROP_KEYS = _.keys(appDataSchema.properties);
const DEFAULTS = jsonSchemaDefaults(appDataSchema);
const PROP_SCHEMA = appDataSchema.properties;

const SAVE_DEPENDENCIES = {
  subscriptions: "subscriptionSettings",
  sites: "siteSettings",
};
const LOAD_DEPENDENCIES = _.invert(SAVE_DEPENDENCIES);

export default class AppData extends EventEmitter {
  static load() {
    return (new AppData()).load();
  }
  static get schema() {
    return appDataSchema;
  }

  constructor(data) {
    super();
    this.data = {};
    this.overwrite(data);
    this._bindEvents();
  }

  overwrite(data) {
    _(data)
    .pick(PROP_KEYS)
    .defaults(DEFAULTS)
    .each((v, k) => { this[k] = v; });
  }

  _bindEvents() {
    chrome.storage.onChanged.addListener((changes) => {
      const changedValues = _(changes).pick(PROP_KEYS).mapValues("newValue").value();
      const changedKeys = _.transform(changedValues, (keys, val, key) => {
        keys.push(key);
        if (LOAD_DEPENDENCIES[key]) keys.push(LOAD_DEPENDENCIES[key]);
      }, []);

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
    minutes = parseInt(minutes, 10);
    if (isNaN(minutes) || minutes < PROP_SCHEMA.updatePeriodMinutes.minimum) {
      this.data.updatePeriodMinutes = DEFAULTS.updatePeriodMinutes;
    } else {
      this.data.updatePeriodMinutes = minutes;
    }
  }

  get lastUpdatedAt() {
    return this.data.lastUpdatedAt;
  }
  set lastUpdatedAt(time) {
    this.data.lastUpdatedAt = parseInt(time, 10) || null;
  }

  get nextWillUpdateAt() {
    if (!this.lastUpdatedAt) return _.now();
    return this.lastUpdatedAt + this.updatePeriodMinutes * 60 * 1000;
  }

  get siteSettings() {
    return this.data.siteSettings;
  }
  set siteSettings(siteSettings) {
    this.data.siteSettings = _.defaultsDeep(siteSettings, DEFAULTS.siteSettings);
    this._sites = null;
  }
  get sites() {
    if (!this._sites) {
      this._sites = SiteFactory.createMap(this.siteSettings);
    }
    return this._sites;
  }

  get subscriptionSettings() {
    return this.data.subscriptionSettings;
  }
  set subscriptionSettings(settings) {
    // Fill missing keys with default values
    settings = _(settings || [])
      .concat(DEFAULTS.subscriptionSettings)
      .uniqBy("feedName").value();

    this.data.subscriptionSettings = settings;
    this._subscriptions = null;
  }
  get subscriptions() {
    if (!this._subscriptions) {
      this._subscriptions = _.map(this.subscriptionSettings, sub => new Subscription(sub));
    }
    return this._subscriptions;
  }
  set subscriptions(subscriptions) {
    this.subscriptionSettings = _.invokeMap(subscriptions, "toObject");
  }

  load() {
    logger("Loading");
    return cutil.localGet(PROP_KEYS).then((data) => {
      this.overwrite(data);
      logger("Loaded successfully", this.data);

      this.emit("update", this, PROP_KEYS.concat(_.values(LOAD_DEPENDENCIES)));
      return this;
    });
  }

  save(keys) {
    if (keys) {
      keys = _(keys).map(key => SAVE_DEPENDENCIES[key] || key).uniq().value();
    }
    const savedData = keys ? _.pick(this.data, keys) : this.data;
    logger("Saving", savedData);
    return cutil.localSet(savedData).then(() => {
      logger("Saved successfully", keys, this.data);
      return this;
    });
  }
}
