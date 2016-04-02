import EventEmitter from "eventemitter3";
import jsonSchemaDefaults from "json-schema-defaults";
import cutil from "../util/chrome-util";
import optionsSchema from "./options-schema.json";

const OPTION_KEYS = _.keys(optionsSchema.properties);
const DEFAULT_OPTIONS = jsonSchemaDefaults(optionsSchema);
const MINIMUM_UPDATE_PERIOD_MINUTES =
  optionsSchema.properties.updatePeriodMinutes.minimum;

export default class Options extends EventEmitter {
  static load() {
    return (new Options()).load();
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
    .defaultsDeep(DEFAULT_OPTIONS)
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
    return optionsSchema;
  }

  get updatePeriodMinutes() {
    return this.options.updatePeriodMinutes;
  }
  set updatePeriodMinutes(minutes) {
    minutes = parseInt(minutes, 10);
    if (isNaN(minutes) || minutes < MINIMUM_UPDATE_PERIOD_MINUTES) {
      this.options.updatePeriodMinutes = DEFAULT_OPTIONS.updatePeriodMinutes;
    } else {
      this.options.updatePeriodMinutes = minutes;
    }
  }

  get lastUpdatedAt() {
    return this.options.lastUpdatedAt;
  }
  set lastUpdatedAt(time) {
    this.options.lastUpdatedAt = time;
  }

  get nextWillUpdateAt() {
    if (!this.lastUpdatedAt) return _.now();
    return this.lastUpdatedAt + this.updatePeriodMinutes * 60 * 1000;
  }

  get siteSettings() {
    return this.options.siteSettings;
  }
  set siteSettings(siteSettings) {
    this.options.siteSettings = siteSettings;
  }

  get subscriptionSettings() {
    return this.options.subscriptionSettings;
  }
  set subscriptionSettings(subscriptionSettings) {
    this.options.subscriptionSettings = subscriptionSettings;
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
