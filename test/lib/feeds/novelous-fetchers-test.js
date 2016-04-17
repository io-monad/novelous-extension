import { _, assert } from "../../common";
import NovelousFetchers from "../../../app/scripts/lib/feeds/novelous-fetchers";

describe("NovelousFetchers", () => {
  it("is an Object", () => {
    assert(_.isObject(NovelousFetchers));
  });
  it("includes narou-messages", () => {
    assert(_.isFunction(NovelousFetchers.narou["/messages"]));
  });
  it("includes kakuyomu-reviews", () => {
    assert(_.isFunction(NovelousFetchers.kakuyomu["/reviews"]));
  });
});
