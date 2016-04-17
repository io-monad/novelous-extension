import { _, assert } from "../../common";
import Sites from "../../../app/scripts/lib/sites";

describe("Sites", () => {
  it("is an Object", () => {
    assert(_.isObject(Sites));
  });
  it("includes Narou", () => {
    assert(_.isObject(Sites.narou));
  });
  it("includes Kakuyomu", () => {
    assert(_.isObject(Sites.kakuyomu));
  });
});
