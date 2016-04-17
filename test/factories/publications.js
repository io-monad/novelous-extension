import _ from "lodash";
import factory from "factory-girl";
import Publication from "../../app/scripts/lib/publications/publication";

const publicationSchema = {
  title: factory.seq(n => `Test title ${n}`),
  body: factory.seq(n => `Test body ${n}\nHello, world!`),
  time: factory.seq(n => `2016-03-01T02:34:${_.padStart(n, 2, "0")}.000Z`),
  sites: {
    narou: { novelId: "12345" },
  },
};

factory.define("publication", Publication, publicationSchema);
factory.define("publicationSettings", Object, publicationSchema);

module.exports = factory;
