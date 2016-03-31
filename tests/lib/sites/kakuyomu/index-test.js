import { test } from "../../../common";
import Kakuyomu from "../../../../app/scripts/lib/sites/kakuyomu";

test("new Kakuyomu", t => {
  const kakuyomu = new Kakuyomu;
  t.ok(kakuyomu instanceof Kakuyomu);
  t.is(kakuyomu.name, "kakuyomu");
  t.ok(_.isString(kakuyomu.displayName));
  t.ok(_.isString(kakuyomu.baseUrl));
});
