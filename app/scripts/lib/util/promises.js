import _ from "lodash";

/**
 * Utilities for Promises
 */

/**
 * Array#forEach with Promise
 *
 * @param {Array} arr - Array to be iterated.
 * @param {Object} [options] - Options.
 * @param {number} [options.interval] - Interval milliseconds between calls.
 * @param {function(item:any):Promise} fn - Iteratee function.
 * @return {Promise}
 *     A Promise which is resolved when all of iteration has been completed.
 *     Or rejected with the value returned by a rejected Promise from `fn`.
 */
function each(arr, options, fn) {
  return _iterator(arr, options, fn, value => {
    if (value === false) return false;
    return true;
  });
}

/**
 * Array#map with Promise
 *
 * @param {Array} arr - Array to be iterated.
 * @param {Object} [options] - Options.
 * @param {number} [options.interval] - Interval milliseconds between calls.
 * @param {function(item:any):Promise.<any>} fn - Iteratee function.
 * @return {Promise.<Array>}
 *     A Promise which is resolved with mapped values when
 *     all of iteration has been completed.
 *     Or rejected with the value returned by a rejected Promise from `fn`.
 */
function map(arr, options, fn) {
  const mapped = [];
  return _iterator(arr, options, fn, value => {
    mapped.push(value);
  }).then(() => mapped);
}

/**
 * Array#some with Promise
 *
 * @param {Array} arr
 * @param {Object} [options]
 * @param {function(item:any):Promise.<any>} fn
 * @return {Promise.<boolean>}
 */
function some(arr, options, fn) {
  let hasSome = false;
  return _iterator(arr, options, fn, value => {
    if (value) {
      hasSome = true;
      return false;
    }
    return true;
  }).then(() => hasSome);
}

/**
 * Array#every with Promise
 *
 * @param {Array} arr
 * @param {Object} [options]
 * @param {function(item:any):Promise.<any>} fn
 * @return {Promise.<boolean>}
 */
function every(arr, options, fn) {
  let hasEvery = true;
  return _iterator(arr, options, fn, value => {
    if (!value) {
      hasEvery = false;
      return false;
    }
    return true;
  }).then(() => hasEvery);
}

function _iterator(arr, options, fn, emit) {
  if (arr.length === 0) return Promise.resolve([]);

  if (_.isFunction(options)) {
    fn = options;
    options = null;
  }
  options = options || {};
  const interval = options.interval || 0;

  return new Promise((resolve, reject) => {
    const queue = _.clone(arr);
    const next = () => {
      const item = queue.shift();
      Promise.resolve(fn(item)).then((value) => {
        const ret = emit(value);
        if (queue.length === 0 || ret === false) {
          resolve();
        } else {
          setTimeout(next, interval);
        }
      })
      .catch(reject);
    };
    next();
  });
}

module.exports = {
  each,
  map,
  some,
  every,
};
