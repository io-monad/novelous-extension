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

  test("#isLoginRequired returns boolean", t => {
    const fetcher = settings.fetcher();
    t.true(_.isBoolean(fetcher.isLoginRequired()));
  });

  test.serial("#fetchFeed returns Promise of Feed", t => {
    const fetcher = settings.fetcher();
    const itemsFixture = settings.itemsFixture();
    chrome.cookies.get.callsArgWithAsync(1, {});

    return fetcher.fetchFeed().then(feed => {
      t.true(_.isString(feed.title));
      t.true(_.isString(feed.url));
      t.true(_.isString(feed.siteName));
      t.true(_.isArray(feed.items));

      t.is(feed.items.length, itemsFixture.length);
      t.deepEqual(_.map(feed.items, "id"), _.map(itemsFixture, "id"));
    });
  });

  test.serial("#fetchFeed returns rejected Promise when login required", t => {
    const fetcher = settings.fetcher();
    if (!fetcher.isLoginRequired()) return null;  // Skip test

    chrome.cookies.get.callsArgWithAsync(1, null);

    return fetcher.fetchFeed().then(t.fail).catch(err => {
      t.is(err.name, "LoginRequiredError");
    });
  });
}
