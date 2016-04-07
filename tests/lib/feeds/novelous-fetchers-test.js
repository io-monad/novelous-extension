import { test } from "../../common";
import NovelousFetchers from "../../../app/scripts/lib/feeds/novelous-fetchers";

test("is an Object", t => {
  t.truthy(_.isObject(NovelousFetchers));
});
test("includes narou-messages", t => {
  t.truthy(_.isFunction(NovelousFetchers.narou["/messages"]));
});
test("includes kakuyomu-reviews", t => {
  t.truthy(_.isFunction(NovelousFetchers.kakuyomu["/reviews"]));
});
