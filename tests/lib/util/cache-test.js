import { _, test, sinonsb } from "../../common";
import Cache from "../../../app/scripts/lib/util/cache";

test("#memoize", t => {
  const cache = new Cache;
  const val = cache.memoize("test", () => {
    return 123;
  });
  t.is(val, 123);
  t.is(cache.get("test"), 123);
});

test.serial("#set / #get", t => {
  sinonsb.stub(_, "now").returns(1234567890);
  const cache = new Cache;
  cache.set("test", 123);

  t.is(cache.get("test"), 123);
  t.deepEqual(cache.getEntry("test"), {
    time: 1234567890,
    value: 123,
  });
});

test("#set with enabled = false", t => {
  const cache = new Cache({ enabled: false });
  cache.set("test", 123);

  t.is(cache.getEntry("test"), null);
});

test("#remove", t => {
  const cache = new Cache;
  cache.set("test", 123);
  cache.remove("test");
  t.true(_.isUndefined(cache.get("test")));
  t.is(cache.getEntry("test"), null);
});

test("#flush", t => {
  const cache = new Cache;
  cache.set("test1", 123);
  cache.set("test2", 456);

  cache.flush();
  t.is(cache.getEntry("test1"), null);
  t.is(cache.getEntry("test2"), null);
});

test.serial("#flushExpired", t => {
  const nowStub = sinonsb.stub(_, "now");
  const cache = new Cache({ expiresIn: 1000 });

  nowStub.returns(0);
  cache.set("test1", 123);
  nowStub.returns(500);
  cache.set("test2", 456);
  nowStub.returns(1000);
  cache.flushExpired();

  t.true(cache.getEntry("test1") === null);
  t.true(cache.getEntry("test2") !== null);
});
