import { _, assert, sinon } from "../../common";
import BackgroundAPI from "../../../app/scripts/lib/popup/background-api";
import isPromiseLike from "../../../app/scripts/lib/util/is-promise-like";

describe("BackgroundAPI", () => {
  it("is Object of API methods", () => {
    assert(_.isObject(BackgroundAPI));
    assert(_.isFunction(BackgroundAPI.getAppData));
  });

  it("returns Promise", () => {
    assert(isPromiseLike(BackgroundAPI.getAppData()));
  });

  it("uses getBackgroundPage to call API", () => {
    const stub = sinon.stub();
    chrome.runtime.getBackgroundPage.callsArgWithAsync(0, {
      NovelousAPI: { getAppData: stub.returns("abc") },
    });

    return BackgroundAPI.getAppData(123).then(result => {
      assert(result === "abc");
      assert(stub.calledOnce);
      assert(stub.args[0][0] === 123);
    });
  });
});
