import cutil from "../util/chrome-util";
import optionsSchema from "./options-schema.json";

const STORAGE_OPTIONS_KEY = "options";

const DEFAULT_OPTIONS = {
  sites: {
    narou: true,
    kakuyomu: true,
  },
};

export default class Options {
  static load() {
    return (new Options()).load();
  }

  constructor(options) {
    this.overwrite(options);
  }

  overwrite(options) {
    this.options = _.defaultsDeep(options, DEFAULT_OPTIONS);
  }

  get schema() {
    return optionsSchema;
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
