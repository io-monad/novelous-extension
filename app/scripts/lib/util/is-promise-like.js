import _ from "lodash";

export default function isPromiseLike(obj) {
  return _.isObject(obj) && _.isFunction(obj.then) && _.isFunction(obj.catch);
}
