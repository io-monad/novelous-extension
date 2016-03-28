import test from "ava";
import sinon from "sinon";
import chrome from "sinon-chrome";
import lodash from "lodash";

global.chrome = chrome;
global._ = lodash;

test.afterEach(() => {
  chrome.flush();
});

module.exports = {
  test,
  sinon,
};
