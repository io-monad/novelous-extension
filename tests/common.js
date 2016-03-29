import test from "ava";
import sinon from "sinon";
import chrome from "sinon-chrome";
import lodash from "lodash";
import factory from "factory-girl";
import bluebird from "bluebird";
import requireDir from "require-dir";
requireDir("./factories");

global.chrome = chrome;
global._ = lodash;
const sinonsb = sinon.sandbox.create();

test.afterEach(() => {
  chrome.flush();
  sinonsb.restore();
});

module.exports = {
  test,
  sinon,
  sinonsb,
  factory: factory.promisify(bluebird),
};
