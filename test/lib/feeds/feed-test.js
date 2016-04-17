import { _, assert, factory } from "../../common";
import Feed from "../../../app/scripts/lib/feeds/feed";

describe("Feed", () => {
  it("new Feed", () => {
    const data = {
      title: "test title",
      url: "http://example.com/",
      siteName: "test site",
      siteId: "narou",
      items: [factory.buildSync("feedItem")],
    };
    const feed = new Feed(data);

    assert(feed.title === data.title);
    assert(feed.url === data.url);
    assert(feed.siteName === data.siteName);
    assert(feed.siteId === data.siteId);
    assert.deepEqual(feed.items, data.items);
  });

  describe("#toObject", () => {
    it("returns an Object", () => {
      const feed = new Feed();
      assert(_.isPlainObject(feed.toObject()));
    });
  });
});
