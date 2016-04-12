import { _, test } from "../../common";
import Sites from "../../../app/scripts/lib/sites";

test("is an Object", t => {
  t.truthy(_.isObject(Sites));
});
test("includes Narou", t => {
  t.truthy(_.isObject(Sites.narou));
});
test("includes Kakuyomu", t => {
  t.truthy(_.isObject(Sites.kakuyomu));
});
