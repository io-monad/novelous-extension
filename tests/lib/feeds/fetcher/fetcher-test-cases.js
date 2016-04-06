import { test, sinon } from "../../../common";
import cutil from "../../../../app/scripts/lib/util/chrome-util";

/**
 * Feed fetcher test cases
 */
export default function fetcherTestCases(settings) {
  let translateStub;
  test.before(() => {
    translateStub = sinon.stub(cutil, "translate").returns("test");
  });
  test.after(() => {
    translateStub.restore();
  });

  test("#fetchFeed returns Promise of Feed", t => {
    const fetcher = settings.fetcher();
    const itemsFixture = settings.itemsFixture();

    return fetcher.fetchFeed().then(feed => {
      t.true(_.isString(feed.title));
      t.true(_.isString(feed.url));
      t.true(_.isString(feed.siteName));
      t.true(_.isArray(feed.items));

      t.is(feed.items.length, itemsFixture.length);
      t.same(_.map(feed.items, "id"), _.map(itemsFixture, "id"));
    });
  });
}
