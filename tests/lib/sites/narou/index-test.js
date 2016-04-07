import { test, sinonsb, factory } from "../../../common";
import Narou from "../../../../app/scripts/lib/sites/narou";

test("new Narou", t => {
  const narou = new Narou;
  t.truthy(narou instanceof Narou);
  t.is(narou.name, "narou");
  t.truthy(_.isString(narou.displayName));
  t.truthy(_.isString(narou.baseUrl));
});

test("#publish", t => {
  const narou = new Narou;
  const pub = factory.buildSync("publication");
  const stub = sinonsb.stub(narou.formOpener, "openForm");
  stub.returns(Promise.resolve());

  return narou.publish(pub).then(() => {
    t.truthy(stub.calledOnce);
    t.is(stub.args[0][0], pub);
  });
});
