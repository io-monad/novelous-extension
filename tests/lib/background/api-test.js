import { _, test, sinon } from "../../common";
import buildAPI from "../../../app/scripts/lib/background/api";

test("builds API", t => {
  const method = sinon.spy();
  const controller = {
    getAppData: method,
    markBadgeAsSeen: () => {},
    updateSubscriptions: () => {},
    publishNovel: () => {},
    privateMethod: () => {},
  };
  const api = buildAPI(controller);

  t.true(_.isFunction(api.getAppData));
  t.true(_.isUndefined(api.privateMethod));

  api.getAppData(1, 2, 3);
  t.true(method.called);
  t.deepEqual(method.args[0], [1, 2, 3]);
  t.is(method.thisValues[0], controller);
});

test("has list of API", t => {
  t.true(_.isArray(buildAPI.list));
  t.true(_.includes(buildAPI.list, "getAppData"));
});
