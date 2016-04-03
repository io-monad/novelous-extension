import EventEmitter from "eventemitter3";
import jsonSchemaDefaults from "json-schema-defaults";
import cutil from "../util/chrome-util";
import appDataSchema from "./app-data-schema.json";
import SiteFactory from "../sites/site-factory";
import Subscription from "../subscriptions/subscription";

const PROP_KEYS = _.keys(appDataSchema.properties);
const DEFAULTS = jsonSchemaDefaults(appDataSchema);
const PROP_SCHEMA = appDataSchema.properties;

export default class AppData extends EventEmitter {
  static load() {
    return (new AppData()).load();
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
      _(changes).pick(PROP_KEYS).each(({ newValue }, key) => {
        this[key] = newValue;
      });
      this.emit("update", this);
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
    settings = settings || [];

    // Fill missing keys with default values
    settings = _.uniqWith(
      settings.concat(DEFAULTS.subscriptionSettings),
      (a, b) => (
        a.siteName === b.siteName &&
        a.itemType === b.itemType &&
        ((!a.itemId && !b.itemId) || (a.itemId === b.itemId))
      )
    );

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
    return new Promise((resolve, reject) => {
      cutil.localGet(PROP_KEYS).then((data) => {
        this.overwrite(data);
        this.emit("update", this);
        resolve(this);
      }).catch(reject);
    });
  }

  save() {
    return new Promise((resolve, reject) => {
      cutil.localSet(this.data)
      .then(() => { resolve(this); })
      .catch(reject);
    });
  }
}
