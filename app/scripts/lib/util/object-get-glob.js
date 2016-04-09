import _ from "lodash";

/**
 * Get property values from object with glob `*` support.
 *
 * @param object - Object to query.
 * @param {string} path - Path of the properties to get.
 *     It can be a deep path using `.` (dots) to separate keys.
 *     If some key in the path is "*", then it will iterate over its value and
 *     collect every properties matching following keys.
 * @return {Array} Values of matched properties.
 *     Always returns an array even if there is only one matched property.
 *     If there is no match, returns an empty array.
 */
export default function objectGetGlob(object, path) {
  path = _.toString(path);
  if (path === "") return [];

  const keys = path.split(".");
  return (function next(obj, index) {
    if (!_.isObject(obj) && !_.isArray(obj)) return [];
    const key = keys[index];
    const atEnd = index + 1 >= keys.length;
    const values = key === "*" ? _.values(obj) : [obj[key]];
    return atEnd ? values : _.flatMap(values, val => next(val, index + 1));
  }(object, 0));
}
