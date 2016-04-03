import { test } from "../../common";
import ValueTypes from "../../../app/scripts/lib/watchers/value-types";

test("any.filter returns value as-is", t => {
  const obj = {};
  t.ok(ValueTypes.any.filter(obj) === obj);
  const arr = [];
  t.ok(ValueTypes.any.filter(arr) === arr);

  t.ok(ValueTypes.any.filter(1) === 1);
  t.ok(ValueTypes.any.filter(null) === null);
});

test("any.diffCount returns 0 for same valeus", t => {
  t.is(ValueTypes.any.diffCount({}, {}), 0);
  t.is(ValueTypes.any.diffCount([], []), 0);
  t.is(ValueTypes.any.diffCount([1], [1]), 0);
  t.is(ValueTypes.any.diffCount(10, 10), 0);
  t.is(ValueTypes.any.diffCount(true, true), 0);
  t.is(ValueTypes.any.diffCount("a", "a"), 0);
});

test("any.diffCount returns 1 for different valeus", t => {
  t.is(ValueTypes.any.diffCount({ a: 1 }, {}), 1);
  t.is(ValueTypes.any.diffCount(15, 10), 1);
  t.is(ValueTypes.any.diffCount(true, false), 1);
  t.is(ValueTypes.any.diffCount("a", "z"), 1);
});

test("any.diffCount returns diff of length for Array-like objects", t => {
  t.is(ValueTypes.any.diffCount([1, 2, 3], []), 3);
  t.is(ValueTypes.any.diffCount([1, 2, 3], [1]), 2);
  t.is(ValueTypes.any.diffCount([1], [1, 2, 3]), 0);
});

test("number.filter returns sum of numbers", t => {
  t.is(ValueTypes.number.filter([1, 2, 3]), 6);
  t.is(ValueTypes.number.filter([]), 0);
  t.is(ValueTypes.number.filter(5), 5);
});

test("number.diffCount returns diff of numbers", t => {
  t.is(ValueTypes.number.diffCount(5, 2), 3);
  t.is(ValueTypes.number.diffCount(0, 0), 0);
  t.is(ValueTypes.number.diffCount(1, 3), 0);
});

test("set.filter returns unique members", t => {
  t.same(ValueTypes.set.filter([1, 2, 3]), [1, 2, 3]);
  t.same(ValueTypes.set.filter([]), []);
  t.same(ValueTypes.set.filter([1, 1, 2, 2]), [1, 2]);
});

test("set.diffCount returns number of new members", t => {
  t.is(ValueTypes.set.diffCount([1, 2, 3], [1]), 2);
  t.is(ValueTypes.set.diffCount([], []), 0);
  t.is(ValueTypes.set.diffCount([1], [1, 2, 3]), 0);
});

test("count.filter returns length of values", t => {
  t.is(ValueTypes.count.filter([1, 2, 3]), 3);
  t.is(ValueTypes.count.filter([]), 0);
  t.is(ValueTypes.count.filter(5), 1);
});

test("count.diffCount returns diff of numbers", t => {
  t.is(ValueTypes.count.diffCount(5, 2), 3);
  t.is(ValueTypes.count.diffCount(0, 0), 0);
  t.is(ValueTypes.count.diffCount(1, 3), 0);
});
