import { assert } from "../../common";
import FetcherFactory from "../../../app/scripts/lib/feeds/fetcher-factory";
import FetcherNarouComments from "../../../app/scripts/lib/feeds/fetcher/narou-comments";

describe("FetcherFactory", () => {
  describe("#create", () => {
    it("returns FeedFetcher", () => {
      const fetcher = FetcherFactory.create("novelous-feed://narou/comments");
      assert(fetcher instanceof FetcherNarouComments);
    });

    it("throws Error for unknown protocol in feed url", () => {
      assert.throws(
        () => { FetcherFactory.create("test://narou/messages"); },
        /Not supported protocol: test:\/\/narou\/messages/
      );
    });

    it("throws Error for unknown novelous-feed: url", () => {
      assert.throws(
        () => { FetcherFactory.create("novelous-feed://narou/nonexist"); },
        /Unknown novelous-feed URL: novelous-feed:\/\/narou\/nonexist/
      );
    });
  });
});
