import test from "ava";
import sinon from "sinon";
import chrome from "sinon-chrome";
import lodash from "lodash";
import debug from "debug";
import factory from "factory-girl";
import bluebird from "bluebird";
import requireDir from "require-dir";
import fixture from "./test-utils/fixture-loader";
import fakeSererRequest from "./test-utils/fake-server-request";
import fakeServerConf from "./fake-server.conf";
import FactoryAdapter from "./test-utils/factory-adapter";

requireDir("./factories");

global.__ENV__ = "test";
global.__VENDOR__ = "chrome";
global.LIVERELOAD = false;

global.XMLHttpRequest = fakeSererRequest(fakeServerConf);
global.chrome = chrome;
global.debug = debug;
const sinonsb = sinon.sandbox.create();

test.afterEach(() => {
  chrome.flush();
  sinonsb.restore();
});

factory.setAdapter(new FactoryAdapter());

module.exports = {
  _: lodash,
  test,
  sinon,
  sinonsb,
  fixture,
  factory: factory.promisify(bluebird),
};
