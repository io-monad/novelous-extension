import _ from "lodash";
import factory from "../test-utils/factory";
import Publication from "../../app/scripts/lib/publications/publication";

const publicationSchema = {
  title: factory.seqstr("Test title #"),
  body: factory.seqstr("Test body #\nHello, world!"),
  time: factory.seq(n => `2016-03-01T02:34:${_.padStart(n, 2, "0")}.000Z`),
  sites: {
    narou: { novelId: "12345" },
  },
};

factory.define("publication", Publication, publicationSchema);
factory.define("publicationSettings", Object, publicationSchema);
