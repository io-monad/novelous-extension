import { _, test } from "../../../common";
import Narou from "../../../../app/scripts/lib/sites/narou";

test("properties", t => {
  t.true(_.isString(Narou.name));
  t.true(_.isString(Narou.url));
  t.true(_.isString(Narou.iconUrl));
  t.true(_.isFunction(Narou.publish));
  t.true(_.isObject(Narou.API));
  t.true(_.isObject(Narou.URL));
});
