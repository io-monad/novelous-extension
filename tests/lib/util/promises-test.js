import { test, sinonsb } from "../../common";
import promises from "../../../app/scripts/lib/util/promises";

test("#each iterates all over items", t => {
  const arr = [1, 2, 3, 4, 5];
  let index = 0;
  t.plan(arr.length);
  return promises.each(arr, (val) => {
    t.is(val, arr[index++]);
  });
});

test("#each clones the original array", t => {
  const arr = [1, 2, 3, 4, 5];
  t.plan(arr.length);
  return promises.each(arr, (val) => {
    t.is(val, arr.shift());
  });
});

test("#each stops iteration when false returned", t => {
  const arr = [1, 2, 3, 4, 5];
  let index = 0;
  t.plan(2);
  return promises.each(arr, (val) => {
    t.is(val, arr[index++]);
    return false;
  }).then(() => {
    t.is(index, 1);
  });
});

test.cb("#each rejects a Promise when rejected by iteratee", t => {
  const arr = [1, 2, 3, 4, 5];
  let index = 0;
  promises.each(arr, () => {
    index++;
    if (index === 2) return Promise.reject("TEST REJECT");
    return Promise.resolve();
  })
  .then(() => {
    t.fail();
    t.end();
  })
  .catch((e) => {
    t.is(index, 2);
    t.is(e, "TEST REJECT");
    t.end();
  });
});

test.serial("#each waits for interval between iteration", t => {
  const clock = sinonsb.useFakeTimers();

  const arr = [1, 2, 3, 4, 5];
  let index = 0;
  let lastTime = +(new Date);
  const promise = promises.each(arr, { interval: 1000 }, () => {
    const time = +(new Date);
    if (index === 0) {
      t.is(time, lastTime);
    } else {
      t.is(time, lastTime + 1000);
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

test.serial("#map resolves a Promise with mapped values", t => {
  const arr = [1, 2, 3, 4, 5];
  return promises.map(arr, (val) => {
    return val * 10;
  }).then((mapped) => {
    t.deepEqual(mapped, [10, 20, 30, 40, 50]);
  });
});
