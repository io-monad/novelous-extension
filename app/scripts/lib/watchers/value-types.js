/**
 * Value types used for Watcher.
 */
export default {
  any: {
    filter(value) {
      return value;
    },
    diffCount(newValue, oldValue) {
      if (_.isArrayLikeObject(newValue) && _.isArrayLikeObject(oldValue)) {
        return Math.max(0, newValue.length - oldValue.length);
      }
      return _.isEqual(newValue, oldValue) ? 0 : 1;
    },
  },

  number: {
    filter(value) {
      return _.sum(_.castArray(value));
    },
    diffCount(newValue, oldValue) {
      return Math.max(0, (newValue || 0) - (oldValue || 0));
    },
  },

  set: {
    filter(value) {
      return _.uniq(_.castArray(value));
    },
    diffCount(newValue, oldValue) {
      return _.difference(newValue || [], oldValue || []).length;
    },
  },

  count: {
    filter(value) {
      return _.castArray(value).length;
    },
    diffCount(newValue, oldValue) {
      return Math.max(0, (newValue || 0) - (oldValue || 0));
    },
  },
};
