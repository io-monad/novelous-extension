import { test } from "../../common";
import Sites from "../../../app/scripts/lib/sites/sites";

test("is an Object", t => {
  t.truthy(_.isObject(Sites));
});
test("includes Narou", t => {
  t.truthy(_.isFunction(Sites.narou));
});
test("includes Kakuyomu", t => {
  t.truthy(_.isFunction(Sites.kakuyomu));
});
