import { assert, sinonsb } from "../../common";
import promises from "../../../app/scripts/lib/util/promises";

describe("promises", () => {
  describe("#each", () => {
    it("iterates all over items", () => {
      const arr = [1, 2, 3, 4, 5];
      let index = 0;
      return promises.each(arr, (val) => {
        assert(val === arr[index++]);
      });
    });

    it("clones the original array", () => {
      const arr = [1, 2, 3, 4, 5];
      return promises.each(arr, (val) => {
        assert(val === arr.shift());
      });
    });

    it("stops iteration when false returned", () => {
      const arr = [1, 2, 3, 4, 5];
      let index = 0;
      return promises.each(arr, (val) => {
        assert(val === arr[index++]);
        return false;
      }).then(() => {
        assert(index === 1);
      });
    });

    it("rejects a Promise when rejected by iteratee", (done) => {
      const arr = [1, 2, 3, 4, 5];
      let index = 0;
      promises.each(arr, () => {
        index++;
        if (index === 2) return Promise.reject("TEST REJECT");
        return Promise.resolve();
      })
      .then(() => {
        assert(false);
        done();
      })
      .catch((e) => {
        assert(index === 2);
        assert(e === "TEST REJECT");
        done();
      });
    });

    it("waits for interval between iteration", () => {
      const clock = sinonsb.useFakeTimers();

      const arr = [1, 2, 3, 4, 5];
      let index = 0;
      let lastTime = +(new Date);
      const promise = promises.each(arr, { interval: 1000 }, () => {
        const time = +(new Date);
        if (index === 0) {
          assert(time === lastTime);
        } else {
          assert(time === lastTime + 1000);
        }
        lastTime = time;
        index++;
      });

      // Clock advances like 0 -> 500 -> 1000 -> 1500 ...
      setImmediate(function ticker() {
        if (index >= arr.length) {
          return;
        }
        clock.tick(500);
        setImmediate(ticker);
      });
      clock.tick(0);

      return promise;
    });
  });

  describe("#map", () => {
    it("resolves a Promise with mapped values", () => {
      const arr = [1, 2, 3, 4, 5];
      return promises.map(arr, (val) => {
        return val * 10;
      }).then((mapped) => {
        assert.deepEqual(mapped, [10, 20, 30, 40, 50]);
      });
    });
  });

  describe("#some", () => {
    it("resolves a Promise with true if some truthy", () => {
      const arr = [1, 2, 3, 4, 5];
      return promises.some(arr, (val) => {
        return val === 3;
      }).then((result) => {
        assert(result);
      });
    });

    it("resolves a Promise with false if all falsy", () => {
      const arr = [1, 2, 3, 4, 5];
      return promises.some(arr, (val) => {
        return val > 5;
      }).then((result) => {
        assert(!result);
      });
    });
  });

  describe("#every", () => {
    it("resolves a Promise with true if all truthy", () => {
      const arr = [1, 2, 3, 4, 5];
      return promises.every(arr, (val) => {
        return val <= 5;
      }).then((result) => {
        assert(result);
      });
    });
  });

  describe("#some", () => {
    it("resolves a Promise with false if some falsy", () => {
      const arr = [1, 2, 3, 4, 5];
      return promises.every(arr, (val) => {
        return val !== 3;
      }).then((result) => {
        assert(!result);
      });
    });
  });
});
