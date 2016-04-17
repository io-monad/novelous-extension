import { _, assert, sinon } from "../../common";
import buildAPI from "../../../app/scripts/lib/background/api";

describe("Background buildAPI", () => {
  it("builds API", () => {
    const method = sinon.spy();
    const controller = {
      getAppData: method,
      markBadgeAsSeen: () => {},
      updateSubscriptions: () => {},
      publishNovel: () => {},
      privateMethod: () => {},
    };
    const api = buildAPI(controller);

    assert(_.isFunction(api.getAppData));
    assert(_.isUndefined(api.privateMethod));

    api.getAppData(1, 2, 3);
    assert(method.called);
    assert.deepEqual(method.args[0], [1, 2, 3]);
    assert(method.thisValues[0] === controller);
  });

  it("has list of API", () => {
    assert(_.isArray(buildAPI.list));
    assert(_.includes(buildAPI.list, "getAppData"));
  });
});
