import { test, factory } from "../../common";
import Publication from "../../../app/scripts/lib/publications/publication";

test.beforeEach(t => {
  t.context.settings = factory.buildSync("publicationSettings");
  t.context.pub = new Publication(t.context.settings);
});

test("new Publication", t => {
  t.ok(t.context.pub instanceof Publication);
});

test("has properties", t => {
  const { pub, settings } = t.context;
  t.is(pub.title, settings.title);
  t.is(pub.body, settings.body);
  t.ok(pub.time instanceof Date);
  t.is(pub.time.toISOString(), settings.time);
  t.same(pub.sites, settings.sites);
});
