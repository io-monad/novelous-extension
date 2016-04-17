import { _, assert, sinon } from "../../../common";
import cutil from "../../../../app/scripts/lib/util/chrome-util";

/**
 * Feed fetcher test cases
 */
export default function fetcherTestCases(settings) {
  let translateStub;
  before(() => {
    translateStub = sinon.stub(cutil, "translate").returns("test");
  });
  after(() => {
    translateStub.restore();
  });

  describe("#isLoginRequired", () => {
    it("returns boolean", () => {
      const fetcher = settings.fetcher();
      assert(_.isBoolean(fetcher.isLoginRequired()));
    });
  });

  describe("#fetchFeed", () => {
    it("returns Promise of Feed", () => {
      const fetcher = settings.fetcher();
      const itemsFixture = settings.itemsFixture();
      chrome.cookies.get.callsArgWithAsync(1, {});

      return fetcher.fetchFeed().then(feed => {
        assert(_.isString(feed.title));
        assert(_.isString(feed.url));
        assert(_.isString(feed.siteName));
        assert(_.isArray(feed.items));

        assert(feed.items.length === itemsFixture.length);
        assert.deepEqual(_.map(feed.items, "id"), _.map(itemsFixture, "id"));
      });
    });

    it("returns rejected Promise when login required", () => {
      const fetcher = settings.fetcher();
      if (!fetcher.isLoginRequired()) return null;  // Skip test

      chrome.cookies.get.callsArgWithAsync(1, null);

      return fetcher.fetchFeed().catch(err => {
        assert(err.name === "LoginRequiredError");
      });
    });
  });
}
