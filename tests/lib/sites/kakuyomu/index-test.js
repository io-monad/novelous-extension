import { test, sinonsb, factory } from "../../../common";
import Kakuyomu from "../../../../app/scripts/lib/sites/kakuyomu";

test("new Kakuyomu", t => {
  const kakuyomu = new Kakuyomu;
  t.ok(kakuyomu instanceof Kakuyomu);
  t.is(kakuyomu.name, "kakuyomu");
  t.ok(_.isString(kakuyomu.displayName));
  t.ok(_.isString(kakuyomu.baseUrl));
});

test("#publish", t => {
  const kakuyomu = new Kakuyomu;
  const pub = factory.buildSync("publication", { sites: { kakuyomu: "123" } });
  const stub = sinonsb.stub(kakuyomu.formOpener, "openForm");
  stub.returns(Promise.resolve());

  return kakuyomu.publish(pub).then(() => {
    t.ok(stub.calledOnce);
    t.is(stub.args[0][0], pub);
  });
});
