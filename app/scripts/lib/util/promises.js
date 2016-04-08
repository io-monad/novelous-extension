/**
 * Utilities for Promises
 */

/**
 * Simple for-each loop with Promise
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
 * Simple for-each loop with Promise
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
};
