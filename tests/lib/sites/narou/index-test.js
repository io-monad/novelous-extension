import { test } from "../../../common";
import Narou from "../../../../app/scripts/lib/sites/narou";

test("new Narou", t => {
  const narou = new Narou;
  t.ok(narou instanceof Narou);
  t.is(narou.name, "narou");
  t.ok(_.isString(narou.displayName));
  t.ok(_.isString(narou.baseUrl));
});
