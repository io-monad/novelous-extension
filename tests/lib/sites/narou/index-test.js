import { test, sinonsb, factory } from "../../../common";
import Narou from "../../../../app/scripts/lib/sites/narou";

test("new Narou", t => {
  const narou = new Narou;
  t.ok(narou instanceof Narou);
  t.is(narou.name, "narou");
  t.ok(_.isString(narou.displayName));
  t.ok(_.isString(narou.baseUrl));
});

test("#publish", t => {
  const narou = new Narou;
  const pub = factory.buildSync("publication");
  const stub = sinonsb.stub(narou.formOpener, "openForm");
  stub.returns(Promise.resolve());

  return narou.publish(pub).then(() => {
    t.ok(stub.calledOnce);
    t.is(stub.args[0][0], pub);
  });
});
