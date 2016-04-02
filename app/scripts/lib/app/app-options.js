import EventEmitter from "eventemitter3";
import jsonSchemaDefaults from "json-schema-defaults";
import cutil from "../util/chrome-util";
import appOptionsSchema from "./app-options-schema.json";
import SiteFactory from "../sites/site-factory";
import Subscription from "../subscriptions/subscription";

const OPTION_KEYS = _.keys(appOptionsSchema.properties);
const DEFAULT_OPTIONS = jsonSchemaDefaults(appOptionsSchema);
const PROP_SCHEMA = appOptionsSchema.properties;

export default class AppOptions extends EventEmitter {
  static load() {
    return (new AppOptions()).load();
  }

  constructor(options) {
    super();
    this.options = {};
    this.overwrite(options);
    this._bindEvents();
  }

  overwrite(options) {
    _(options)
    .pick(OPTION_KEYS)
    .defaults(DEFAULT_OPTIONS)
    .each((v, k) => { this[k] = v; });
  }

  _bindEvents() {
    chrome.storage.onChanged.addListener((changes) => {
      _(changes).pick(OPTION_KEYS).each(({ newValue }, key) => {
        this[key] = newValue;
      });
      this.emit("update", this);
    });
  }

  get schema() {
    return appOptionsSchema;
  }

  get updatePeriodMinutes() {
    return this.options.updatePeriodMinutes;
  }
  set updatePeriodMinutes(minutes) {
    minutes = parseInt(minutes, 10);
    if (isNaN(minutes) || minutes < PROP_SCHEMA.updatePeriodMinutes.minimum) {
      this.options.updatePeriodMinutes = DEFAULT_OPTIONS.updatePeriodMinutes;
    } else {
      this.options.updatePeriodMinutes = minutes;
    }
  }

  get lastUpdatedAt() {
    return this.options.lastUpdatedAt;
  }
  set lastUpdatedAt(time) {
    this.options.lastUpdatedAt = parseInt(time, 10) || null;
  }

  get nextWillUpdateAt() {
    if (!this.lastUpdatedAt) return _.now();
    return this.lastUpdatedAt + this.updatePeriodMinutes * 60 * 1000;
  }

  get siteSettings() {
    return this.options.siteSettings;
  }
  set siteSettings(siteSettings) {
    this.options.siteSettings = _.defaultsDeep(siteSettings, DEFAULT_OPTIONS.siteSettings);
    this._sites = null;
  }
  get sites() {
    if (!this._sites) {
      this._sites = SiteFactory.createMap(this.siteSettings);
    }
    return this._sites;
  }

  get subscriptionSettings() {
    return this.options.subscriptionSettings;
  }
  set subscriptionSettings(settings) {
    settings = settings || [];

    // Fill missing keys with default values
    settings = _.uniqWith(
      settings.concat(DEFAULT_OPTIONS.subscriptionSettings),
      (a, b) => (
        a.siteName === b.siteName &&
        a.itemType === b.itemType &&
        ((!a.itemId && !b.itemId) || (a.itemId === b.itemId))
      )
    );

    this.options.subscriptionSettings = settings;
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
      cutil.localGet(OPTION_KEYS).then((options) => {
        this.overwrite(options);
        this.emit("update", this);
        resolve(this);
      }).catch(reject);
    });
  }

  save() {
    return new Promise((resolve, reject) => {
      cutil.localSet(this.options)
      .then(() => { resolve(this); })
      .catch(reject);
    });
  }
}
