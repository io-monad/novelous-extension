import { test } from "../../common";
import objectGetGlob from "../../../app/scripts/lib/util/object-get-glob";

test("non-glob path with single value", t => {
  t.deepEqual(objectGetGlob({ a: { x: 1 } }, "a.x"), [1]);
  t.deepEqual(objectGetGlob([[1, 2, 3]], "0.1"), [2]);
  t.deepEqual(objectGetGlob([{ x: 1 }], "0.x"), [1]);
});
test("glob path with single value", t => {
  t.deepEqual(objectGetGlob({ a: { x: 1 } }, "a.*"), [1]);
  t.deepEqual(objectGetGlob([[1]], "0.*"), [1]);
  t.deepEqual(objectGetGlob([{ x: 1 }], "0.*"), [1]);
});
test("intermediate-glob path with many values", t => {
  t.deepEqual(objectGetGlob({ a: { x: 1 }, b: { x: 2 }, c: { x: 3 } }, "*.x"), [1, 2, 3]);
  t.deepEqual(objectGetGlob([[1], [2], [3]], "*.0"), [1, 2, 3]);
  t.deepEqual(objectGetGlob([{ x: 1 }, { x: 2 }, { x: 3 }], "*.x"), [1, 2, 3]);
});
test("last-glob path with many values", t => {
  t.deepEqual(objectGetGlob({ a: { o: { x: 1, y: 2, z: 3 } } }, "a.o.*"), [1, 2, 3]);
  t.deepEqual(objectGetGlob([[[1, 2, 3]]], "0.0.*"), [1, 2, 3]);
  t.deepEqual(objectGetGlob({ a: [{ x: 1, y: 2, z: 3 }] }, "a.0.*"), [1, 2, 3]);
});
test("muliple globs", t => {
  t.deepEqual(objectGetGlob({ a: { o: { x: 1 } }, b: { p: { x: 2 } } }, "*.*.x"), [1, 2]);
  t.deepEqual(objectGetGlob([[[1], [2]], [[3], [4]]], "*.*.0"), [1, 2, 3, 4]);
  t.deepEqual(objectGetGlob([{ a: { x: 1 } }, [[2], { y: 3 }]], "*.*.*"), [1, 2, 3]);
});
test("single glob only", t => {
  t.deepEqual(objectGetGlob({ a: { x: 1 }, b: { x: 2 } }, "*"), [{ x: 1 }, { x: 2 }]);
  t.deepEqual(objectGetGlob([[1], [2]], "*"), [[1], [2]]);
});

test("result is not flattened", t => {
  t.deepEqual(objectGetGlob({ a: { b: 1 } }, "a"), [{ b: 1 }]);
  t.deepEqual(objectGetGlob({ a: [1, 2, 3] }, "a"), [[1, 2, 3]]);
  t.deepEqual(objectGetGlob({ a: [1], b: { x: 2 } }, "*"), [[1], { x: 2 }]);
});

test("first path is undefined", t => {
  t.deepEqual(objectGetGlob({}, "a.o.x"), []);
  t.deepEqual(objectGetGlob([], "0.1.2"), []);
});
test("intermediate path is undefined", t => {
  t.deepEqual(objectGetGlob({ a: {} }, "a.o.x"), []);
  t.deepEqual(objectGetGlob([[]], "0.0.0"), []);
});
test("last path is undefined", t => {
  t.deepEqual(objectGetGlob({ a: { o: {} } }, "a.o.x"), [undefined]);
  t.deepEqual(objectGetGlob([[[]]], "0.0.0"), [undefined]);
});
test("first glob path has no matches", t => {
  t.deepEqual(objectGetGlob({}, "*.o.x"), []);
  t.deepEqual(objectGetGlob([], "*.0.0"), []);
});
test("intermediate glob path has no matches", t => {
  t.deepEqual(objectGetGlob({ a: {} }, "a.*.x"), []);
  t.deepEqual(objectGetGlob([[]], "0.*.0"), []);
});
test("last glob path has no matches", t => {
  t.deepEqual(objectGetGlob({ a: { o: {} } }, "a.o.*"), []);
  t.deepEqual(objectGetGlob([[[]]], "0.0.*"), []);
});

test("not object nor array", t => {
  t.deepEqual(objectGetGlob("abc", "0"), []);
  t.deepEqual(objectGetGlob(123, "0"), []);
  t.deepEqual(objectGetGlob(false, "0"), []);
  t.deepEqual(objectGetGlob(null, "0"), []);
  t.deepEqual(objectGetGlob(undefined, "0"), []);
});
test("no path", t => {
  t.deepEqual(objectGetGlob([]), []);
  t.deepEqual(objectGetGlob({}), []);
});
