import { test } from "../../common";
import Sites from "../../../app/scripts/lib/sites/sites";

test("is an Object", t => {
  t.ok(_.isObject(Sites));
});
test("includes Narou", t => {
  t.ok(_.isFunction(Sites.narou));
});
test("includes Kakuyomu", t => {
  t.ok(_.isFunction(Sites.kakuyomu));
});
