import _ from "lodash";

/**
 * On-memory caching utility
 */
export default class Cache {
  /**
   * @param {Object} options - Options.
   * @param {boolean} [options.enabled=true]
   *     `true` to enable caching. `false` to disable caching.
   * @param {number|null} [options.expiresIn]
   *     Milliseconds which cache will expire in.
   *     If `null`, caches will never expire.
   */
  constructor(options) {
    options = _.extend({
      enabled: true,
      expiresIn: null,
    }, options);

    this.enabled = options.enabled;
    this.expiresIn = options.expiresIn;
    this.caches = {};
  }

  /**
   * Cache a returned value from function.
   *
   * @param {string} key - Key of cached value.
   * @param {Function} fn - Function to be called if not cached.
   * @return {any} Cached value or returned value from the function.
   */
  memoize(key, fn) {
    if (!this.enabled) return fn();

    const entry = this.getEntry(key);
    if (entry) return entry.value;

    const ret = fn();
    this.set(key, ret);
    return ret;
  }

  /**
   * Get a value from cache.
   *
   * @param {string} key - Key of cached value.
   * @return {any} Value of cache, or `undefined` if not cached.
   */
  get(key) {
    const entry = this.getEntry(key);
    return entry ? entry.value : undefined;
  }

  /**
   * Get a cache entry.
   *
   * @param {string} key - Key of cached entry.
   * @return {{ value: any, time: number }|null}
   */
  getEntry(key) {
    if (!this.enabled) return null;

    const entry = this.caches[key];
    if (!entry) return null;

    if (this._isExpired(entry.time)) {
      this.remove(key);
      return null;
    }
    return entry;
  }

  /**
   * Set a value to cache.
   *
   * @param {string} key - Key of cached value.
   * @param {any} value - Value to be cached.
   */
  set(key, value) {
    if (!this.enabled) return;

    this.caches[key] = {
      value,
      time: _.now(),
    };
  }

  /**
   * Remove a value from cache.
   *
   * @param {string} key - Key of cached value.
   */
  remove(key) {
    delete this.caches[key];
  }

  /**
   * Remove all values from cache.
   */
  flush() {
    this.caches = {};
  }

  /**
   * Remove all expired caches.
   */
  flushExpired() {
    if (!this.expiresIn) return;
    const expire = _.now() - this.expiresIn;
    this.caches = _.omitBy(this.caches, entry => entry.time <= expire);
  }

  _isExpired(time) {
    return this.expiresIn && time + this.expiresIn <= _.now();
  }
}
