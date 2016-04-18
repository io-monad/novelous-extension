import assert from "power-assert";
import sinon from "sinon";
import chrome from "sinon-chrome";
import debug from "debug";
import assertExtension from "./test-utils/assert-extension";
import fakeSererRequest from "./test-utils/fake-server-request";
import fakeServerConf from "./fake-server.conf";

assertExtension(assert);

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
    return assert;
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

    const factory = require("factory-girl");
    const bluebird = require("bluebird");
    const requireDir = require("require-dir");
    const FactoryAdapter = require("./test-utils/factory-adapter").default;

    requireDir("./factories");
    factory.setAdapter(new FactoryAdapter());

    this._factory = factory.promisify(bluebird);
    return this._factory;
  }

  static get render() {
    if (this._render) return this._render;
    this._render = require("react-shallow-renderer");
    return this._render;
  }
}

module.exports = TestExports;
