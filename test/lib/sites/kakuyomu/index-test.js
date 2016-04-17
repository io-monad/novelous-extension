import { _, assert } from "../../../common";
import Kakuyomu from "../../../../app/scripts/lib/sites/kakuyomu";

describe("Kakuyomu", () => {
  it("has properties", () => {
    assert(_.isString(Kakuyomu.name));
    assert(_.isString(Kakuyomu.url));
    assert(_.isString(Kakuyomu.iconUrl));
    assert(_.isFunction(Kakuyomu.publish));
    assert(_.isObject(Kakuyomu.API));
    assert(_.isObject(Kakuyomu.URL));
  });
});
