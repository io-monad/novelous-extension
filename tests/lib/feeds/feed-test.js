import { _, test, factory } from "../../common";
import Feed from "../../../app/scripts/lib/feeds/feed";

test("new Feed", t => {
  const data = {
    title: "test title",
    url: "http://example.com/",
    siteName: "test site",
    siteId: "narou",
    items: [factory.buildSync("feedItem")],
  };
  const feed = new Feed(data);

  t.is(feed.title, data.title);
  t.is(feed.url, data.url);
  t.is(feed.siteName, data.siteName);
  t.is(feed.siteId, data.siteId);
  t.deepEqual(feed.items, data.items);
});

test("#toObject returns an Object", t => {
  const feed = new Feed();
  t.true(_.isPlainObject(feed.toObject()));
});
