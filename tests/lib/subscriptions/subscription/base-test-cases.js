import { _, test, factory, sinonsb } from "../../../common";
import Subscription from "../../../../app/scripts/lib/subscriptions/subscription";
import Feed from "../../../../app/scripts/lib/feeds/feed";
import helpers from "../helpers";

export default function baseTestCasesForSubscription() {
  test("is Subscription", t => {
    const { sub } = t.context;
    t.true(sub instanceof Subscription);
  });

  test("has Subscription properties", t => {
    const { sub, data } = t.context;
    t.is(sub.type, data.type);
    t.is(sub.id, data.feedUrl);
    t.is(sub.feedUrl, data.feedUrl);
    t.is(sub.enabled, data.enabled);
    t.is(sub.lastUpdatedAt, data.lastUpdatedAt);

    t.true(sub.feed instanceof Feed);
    t.is(sub.title, data.feedData.title);
    t.is(sub.url, data.feedData.url);
    t.is(sub.siteName, data.feedData.siteName);
    t.is(sub.siteId, data.feedData.siteId);
    t.deepEqual(sub.items, data.feedData.items);
  });

  test.serial("#update updates holding feed", t => {
    const { sub } = t.context;
    const feed = factory.buildSync("feed");
    const stub = helpers.stubFetchFeed(sub, feed);
    sinonsb.stub(_, "now").returns(1234567890);

    return sub.update().then(returnedFeed => {
      t.true(stub.calledOnce);
      t.is(sub.feed, feed);
      t.is(returnedFeed, feed);
      t.is(sub.lastUpdatedAt, _.now());
    });
  });
}
