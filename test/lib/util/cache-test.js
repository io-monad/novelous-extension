import { _, assert, sinonsb } from "../../common";
import Cache from "../../../app/scripts/lib/util/cache";

describe("Cache", () => {
  describe("#memoize", () => {
    it("memoizes the result of given function", () => {
      const cache = new Cache;
      const val = cache.memoize("test", () => {
        return 123;
      });
      assert(val === 123);
      assert(cache.get("test") === 123);
    });
  });

  describe("#memoizePromise", () => {
    it("memoizes the returned Promise from given function", () => {
      const cache = new Cache;
      return cache.memoizePromise("test", () => {
        return Promise.resolve(123);
      }).then(resolved => {
        assert(resolved === 123);
        assert(cache.get("test") === 123);
      });
    });

    it("does not cache rejected Promise", () => {
      const cache = new Cache;
      return cache.memoizePromise("test", () => {
        return Promise.reject(new Error("error test"));
      }).catch(err => {
        assert(err.message === "error test");
        assert(cache.get("test") === undefined);
      });
    });
  });

  describe("#get / #set", () => {
    it("gets and sets value", () => {
      sinonsb.stub(_, "now").returns(1234567890);
      const cache = new Cache;
      cache.set("test", 123);

      assert(cache.get("test") === 123);
      assert.deepEqual(cache.getEntry("test"), {
        time: 1234567890,
        value: 123,
      });
    });

    it("with enabled = false", () => {
      const cache = new Cache({ enabled: false });
      cache.set("test", 123);

      assert(cache.getEntry("test") === null);
    });
  });

  describe("#remove", () => {
    it("removes a cache", () => {
      const cache = new Cache;
      cache.set("test", 123);
      cache.remove("test");
      assert(_.isUndefined(cache.get("test")));
      assert(cache.getEntry("test") === null);
    });
  });

  describe("#flush", () => {
    it("removes all caches", () => {
      const cache = new Cache;
      cache.set("test1", 123);
      cache.set("test2", 456);

      cache.flush();
      assert(cache.getEntry("test1") === null);
      assert(cache.getEntry("test2") === null);
    });
  });

  describe("#flushExpired", () => {
    it("returns whether the flush ", () => {
      const nowStub = sinonsb.stub(_, "now");
      const cache = new Cache({ expiresIn: 1000 });

      nowStub.returns(0);
      cache.set("test1", 123);
      nowStub.returns(500);
      cache.set("test2", 456);
      nowStub.returns(1000);
      cache.flushExpired();

      assert(cache.getEntry("test1") === null);
      assert(cache.getEntry("test2") !== null);
    });
  });
});
