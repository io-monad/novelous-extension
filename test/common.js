import sinon from "sinon";
import chrome from "sinon-chrome";
import debug from "debug";
import fakeSererRequest from "./test-utils/fake-server-request";
import fakeServerConf from "./fake-server.conf";

global.__ENV__ = "test";
global.__VENDOR__ = "chrome";
global.LIVERELOAD = false;

global.XMLHttpRequest = fakeSererRequest(fakeServerConf);
global.chrome = chrome;
global.debug = debug;
const sinonsb = sinon.sandbox.create();

before(() => {
  const SiteClient = require("../app/scripts/lib/sites/site-client").default;
  SiteClient.DefaultOptions.caching = false;
  SiteClient.DefaultOptions.fetchInterval = 0;
});
afterEach(() => {
  XMLHttpRequest.flush();
  chrome.flush();
  sinonsb.restore();
});

class TestExports {
  static get _() {
    if (this._lodash) return this._lodash;
    this._lodash = require("lodash");
    return this._lodash;
  }
  static get assert() {
    if (this._assert) return this._assert;
    this._assert = require("./test-utils/assert").default;
    return this._assert;
  }
  static get sinon() {
    return sinon;
  }
  static get sinonsb() {
    return sinonsb;
  }
  static get fixture() {
    if (this._fixture) return this._fixture;
    this._fixture = require("./test-utils/fixture-loader").default;
    return this._fixture;
  }
  static get factory() {
    if (this._factory) return this._factory;
    this._factory = require("./test-utils/factory").default;
    const requireDir = require("require-dir");
    requireDir("./factories");
    return this._factory;
  }

  static get render() {
    if (this._render) return this._render;
    this._render = require("./test-utils/react-render").default;
    return this._render;
  }
}

module.exports = TestExports;
