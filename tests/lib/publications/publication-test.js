import { test, factory } from "../../common";
import Publication from "../../../app/scripts/lib/publications/publication";

test.beforeEach(t => {
  t.context.settings = factory.buildSync("publicationSettings");
  t.context.pub = new Publication(t.context.settings);
});

test("new Publication", t => {
  t.truthy(t.context.pub instanceof Publication);
});

test("has properties", t => {
  const { pub, settings } = t.context;
  t.is(pub.title, settings.title);
  t.is(pub.body, settings.body);
  t.truthy(pub.time instanceof Date);
  t.is(pub.time.toISOString(), settings.time);
  t.deepEqual(pub.sites, settings.sites);
});
