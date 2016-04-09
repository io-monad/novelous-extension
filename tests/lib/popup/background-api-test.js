import { test, sinon } from "../../common";
import BackgroundAPI from "../../../app/scripts/lib/popup/background-api";
import isPromiseLike from "../../../app/scripts/lib/util/is-promise-like";

test("is Object of API methods", t => {
  t.true(_.isObject(BackgroundAPI));
  t.true(_.isFunction(BackgroundAPI.getAppData));
});

test("returns Promise", t => {
  t.true(isPromiseLike(BackgroundAPI.getAppData()));
});

test("uses getBackgroundPage to call API", t => {
  const stub = sinon.stub();
  chrome.runtime.getBackgroundPage.callsArgWithAsync(0, {
    NovelousAPI: { getAppData: stub.returns("abc") },
  });

  t.plan(3);
  return BackgroundAPI.getAppData(123).then(result => {
    t.is(result, "abc");
    t.true(stub.calledOnce);
    t.is(stub.args[0][0], 123);
  });
});
