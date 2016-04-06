import { test } from "../../common";
import Feeds from "../../../app/scripts/lib/feeds/feeds";

test("is an Object", t => {
  t.ok(_.isObject(Feeds));
});
test("includes narou-messages", t => {
  t.ok(_.isFunction(Feeds["narou-messages"]));
});
test("includes kakuyomu-reviews", t => {
  t.ok(_.isFunction(Feeds["kakuyomu-reviews"]));
});
