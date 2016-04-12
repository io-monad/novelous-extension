import { _, test } from "../../../common";
import Kakuyomu from "../../../../app/scripts/lib/sites/kakuyomu";

test("properties", t => {
  t.true(_.isString(Kakuyomu.name));
  t.true(_.isString(Kakuyomu.url));
  t.true(_.isString(Kakuyomu.iconUrl));
  t.true(_.isFunction(Kakuyomu.publish));
  t.true(_.isObject(Kakuyomu.API));
  t.true(_.isObject(Kakuyomu.URL));
});
