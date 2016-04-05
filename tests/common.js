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

global.XMLHttpRequest = fakeSererRequest(fakeServerConf);
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
  fixture,
  factory: factory.promisify(bluebird),
};
