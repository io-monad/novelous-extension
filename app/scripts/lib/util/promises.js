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
  if (arr.length === 0) return Promise.resolve();
  return new Promise((resolve, reject) => {
    map(arr, options, fn).then(() => resolve(), reject);
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
  if (arr.length === 0) return Promise.resolve([]);

  if (_.isFunction(options)) {
    fn = options;
    options = null;
  }
  options = options || {};
  const interval = options.interval || 0;
  const mapped = [];

  return new Promise((resolve, reject) => {
    const queue = _.clone(arr);
    const next = () => {
      const item = queue.shift();
      Promise.resolve(fn(item)).then((value) => {
        mapped.push(value);
        if (queue.length === 0) {
          resolve(mapped);
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
