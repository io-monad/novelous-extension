import _ from "lodash";
import factoryGirl from "factory-girl";
import bluebird from "bluebird";
import FactoryAdapter from "./factory-adapter";

const factory = factoryGirl.promisify(bluebird);
factory.setAdapter(new FactoryAdapter());

const TIMESTAMP_BASE = 1462073640000;
const NUMBER_MAX = _.toSafeInteger(Infinity);

factory.buildManySync = (n, name) => {
  return _.times(n, () => factory.buildSync(name));
};

factory.builder = (n, name) => {
  if (_.isString(n) && _.isUndefined(name)) {
    name = n;
    return () => factory.buildSync(name);
  } else {
    return () => factory.buildManySync(n, name);
  }
};

factory.timestamp = (base = TIMESTAMP_BASE) => {
  return () => base + _.random(0, 24 * 60 * 60 * 1000);
};

factory.timestamps = (n, base = TIMESTAMP_BASE) => {
  return () => {
    let time = base;
    return _.times(n, () => (time += _.random(1, 60 * 60 * 1000)));
  };
};

factory.number = (min, max) => {
  if (!_.isUndefined(min) && _.isUndefined(max)) {
    max = min;
    min = 0;
  }
  if (_.isUndefined(max)) {
    max = NUMBER_MAX;
  }
  return () => _.random(min, max);
};

factory.numbers = (n, min, max) => {
  return () => _.times(n, factory.number(min, max));
};

factory.numstr = (str, min, max) => {
  return () => str.replace(/#/g, factory.number(min, max));
};

factory.seqstr = (str) => {
  return factory.seq(n => str.replace(/#/g, n));
};

export default factory;
