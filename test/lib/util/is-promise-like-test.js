import { assert } from "../../common";
import isPromiseLike from "../../../app/scripts/lib/util/is-promise-like";

describe("isPromiseLike", () => {
  it("returns true for Promise", () => {
    assert(isPromiseLike(Promise.resolve()));
  });

  it("returns false for non Promise", () => {
    assert(!isPromiseLike({}));
  });
});
