import { test } from "../../common";
import objectGetGlob from "../../../app/scripts/lib/util/object-get-glob";

test("non-glob path with single value", t => {
  t.same(objectGetGlob({ a: { x: 1 } }, "a.x"), [1]);
  t.same(objectGetGlob([[1, 2, 3]], "0.1"), [2]);
  t.same(objectGetGlob([{ x: 1 }], "0.x"), [1]);
});
test("glob path with single value", t => {
  t.same(objectGetGlob({ a: { x: 1 } }, "a.*"), [1]);
  t.same(objectGetGlob([[1]], "0.*"), [1]);
  t.same(objectGetGlob([{ x: 1 }], "0.*"), [1]);
});
test("intermediate-glob path with many values", t => {
  t.same(objectGetGlob({ a: { x: 1 }, b: { x: 2 }, c: { x: 3 } }, "*.x"), [1, 2, 3]);
  t.same(objectGetGlob([[1], [2], [3]], "*.0"), [1, 2, 3]);
  t.same(objectGetGlob([{ x: 1 }, { x: 2 }, { x: 3 }], "*.x"), [1, 2, 3]);
});
test("last-glob path with many values", t => {
  t.same(objectGetGlob({ a: { o: { x: 1, y: 2, z: 3 } } }, "a.o.*"), [1, 2, 3]);
  t.same(objectGetGlob([[[1, 2, 3]]], "0.0.*"), [1, 2, 3]);
  t.same(objectGetGlob({ a: [{ x: 1, y: 2, z: 3 }] }, "a.0.*"), [1, 2, 3]);
});
test("muliple globs", t => {
  t.same(objectGetGlob({ a: { o: { x: 1 } }, b: { p: { x: 2 } } }, "*.*.x"), [1, 2]);
  t.same(objectGetGlob([[[1], [2]], [[3], [4]]], "*.*.0"), [1, 2, 3, 4]);
  t.same(objectGetGlob([{ a: { x: 1 } }, [[2], { y: 3 }]], "*.*.*"), [1, 2, 3]);
});
test("single glob only", t => {
  t.same(objectGetGlob({ a: { x: 1 }, b: { x: 2 } }, "*"), [{ x: 1 }, { x: 2 }]);
  t.same(objectGetGlob([[1], [2]], "*"), [[1], [2]]);
});

test("result is not flattened", t => {
  t.same(objectGetGlob({ a: { b: 1 } }, "a"), [{ b: 1 }]);
  t.same(objectGetGlob({ a: [1, 2, 3] }, "a"), [[1, 2, 3]]);
  t.same(objectGetGlob({ a: [1], b: { x: 2 } }, "*"), [[1], { x: 2 }]);
});

test("first path is undefined", t => {
  t.same(objectGetGlob({}, "a.o.x"), []);
  t.same(objectGetGlob([], "0.1.2"), []);
});
test("intermediate path is undefined", t => {
  t.same(objectGetGlob({ a: {} }, "a.o.x"), []);
  t.same(objectGetGlob([[]], "0.0.0"), []);
});
test("last path is undefined", t => {
  t.same(objectGetGlob({ a: { o: {} } }, "a.o.x"), [undefined]);
  t.same(objectGetGlob([[[]]], "0.0.0"), [undefined]);
});
test("first glob path has no matches", t => {
  t.same(objectGetGlob({}, "*.o.x"), []);
  t.same(objectGetGlob([], "*.0.0"), []);
});
test("intermediate glob path has no matches", t => {
  t.same(objectGetGlob({ a: {} }, "a.*.x"), []);
  t.same(objectGetGlob([[]], "0.*.0"), []);
});
test("last glob path has no matches", t => {
  t.same(objectGetGlob({ a: { o: {} } }, "a.o.*"), []);
  t.same(objectGetGlob([[[]]], "0.0.*"), []);
});

test("not object nor array", t => {
  t.same(objectGetGlob("abc", "0"), []);
  t.same(objectGetGlob(123, "0"), []);
  t.same(objectGetGlob(false, "0"), []);
  t.same(objectGetGlob(null, "0"), []);
  t.same(objectGetGlob(undefined, "0"), []);
});
test("no path", t => {
  t.same(objectGetGlob([]), []);
  t.same(objectGetGlob({}), []);
});
