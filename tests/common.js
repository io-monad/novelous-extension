import test from "ava";
import sinon from "sinon";
import chrome from "sinon-chrome";
import lodash from "lodash";
import debug from "debug";
import factory from "factory-girl";
import bluebird from "bluebird";
import requireDir from "require-dir";
import sourceMapSupport from "source-map-support";
import fixture from "./test-utils/fixture-loader";
import jsdom from "./test-utils/init-jsdom";
import FactoryAdapter from "./test-utils/factory-adapter";

sourceMapSupport.install();
requireDir("./factories");

global.chrome = chrome;
global._ = lodash;
global.debug = debug;
const sinonsb = sinon.sandbox.create();

test.afterEach(() => {
  chrome.flush();
  sinonsb.restore();
});

factory.setAdapter(new FactoryAdapter());

module.exports = {
  test,
  sinon,
  sinonsb,
  jsdom,
  fixture,
  factory: factory.promisify(bluebird),
};
