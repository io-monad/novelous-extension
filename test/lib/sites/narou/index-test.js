import { _, assert } from "../../../common";
import Narou from "../../../../app/scripts/lib/sites/narou";

describe("Narou", () => {
  it("has properties", () => {
    assert(_.isString(Narou.name));
    assert(_.isString(Narou.url));
    assert(_.isString(Narou.iconUrl));
    assert(_.isFunction(Narou.publish));
    assert(_.isObject(Narou.API));
    assert(_.isObject(Narou.URL));
  });
});
