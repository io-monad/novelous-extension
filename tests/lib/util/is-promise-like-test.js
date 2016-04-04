import { test } from "../../common";
import isPromiseLike from "../../../app/scripts/lib/util/is-promise-like";

test("returns true for Promise", t => {
  t.true(isPromiseLike(Promise.resolve()));
});

test("returns false for non Promise", t => {
  t.false(isPromiseLike({}));
});
