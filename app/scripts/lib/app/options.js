import jsonSchemaDefaults from "json-schema-defaults";
import cutil from "../util/chrome-util";
import optionsSchema from "./options-schema.json";

const STORAGE_OPTIONS_KEY = "options";
const DEFAULT_OPTIONS = jsonSchemaDefaults(optionsSchema);
const MINIMUM_UPDATE_INTERVAL_MINUTES =
  optionsSchema.properties.updateIntervalMinutes.minimum;

export default class Options {
  static load() {
    return (new Options()).load();
  }

  constructor(options) {
    this.options = {};
    this.overwrite(options);
  }

  overwrite(options) {
    _(options)
    .pick(_.keys(DEFAULT_OPTIONS))
    .defaultsDeep(DEFAULT_OPTIONS)
    .each((v, k) => { this[k] = v; });
  }

  get schema() {
    return optionsSchema;
  }

  get updateIntervalMinutes() {
    return this.options.updateIntervalMinutes;
  }
  set updateIntervalMinutes(minutes) {
    minutes = parseInt(minutes, 10);
    if (isNaN(minutes) || minutes < MINIMUM_UPDATE_INTERVAL_MINUTES) {
      this.options.updateIntervalMinutes = DEFAULT_OPTIONS.updateIntervalMinutes;
    } else {
      this.options.updateIntervalMinutes = minutes;
    }
  }

  get sites() {
    return this.options.sites;
  }
  set sites(siteSettings) {
    this.options.sites = siteSettings;
  }

  load() {
    return new Promise((resolve, reject) => {
      cutil.syncGetValue(STORAGE_OPTIONS_KEY).then((options) => {
        this.overwrite(options);
        resolve(this);
      }).catch(reject);
    });
  }

  save() {
    return cutil.syncSetValue(STORAGE_OPTIONS_KEY, this.options);
  }

  observeUpdate(callback) {
    chrome.storage.onChanged.addListener((changes) => {
      if (changes[STORAGE_OPTIONS_KEY]) {
        const { newValue } = changes[STORAGE_OPTIONS_KEY];
        this.overwrite(newValue);
        if (callback) callback(this);
      }
    });
  }
}
