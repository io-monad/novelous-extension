import { _, assert, factory, sinonsb } from "../../../common";
import Subscription from "../../../../app/scripts/lib/subscriptions/subscription";
import Feed from "../../../../app/scripts/lib/feeds/feed";
import helpers from "../helpers";

export default function baseTestCasesForSubscription(context) {
  it("is Subscription", () => {
    const { sub } = context;
    assert(sub instanceof Subscription);
  });

  it("has Subscription properties", () => {
    const { sub, data } = context;
    assert(sub.type === data.type);
    assert(sub.id === data.feedUrl);
    assert(sub.feedUrl === data.feedUrl);
    assert(sub.enabled === data.enabled);
    assert(sub.lastUpdatedAt === data.lastUpdatedAt);

    assert(sub.feed instanceof Feed);
    assert(sub.title === data.feedData.title);
    assert(sub.url === data.feedData.url);
    assert(sub.siteName === data.feedData.siteName);
    assert(sub.siteId === data.feedData.siteId);
    assert.deepEqual(sub.items, data.feedData.items);
  });

  describe("#update", () => {
    it("updates holding feed", () => {
      const { sub } = context;
      const feed = factory.buildSync("feed");
      const stub = helpers.stubFetchFeed(sub, feed);
      sinonsb.stub(_, "now").returns(1234567890);

      return sub.update().then(returnedFeed => {
        assert(stub.calledOnce);
        assert(sub.feed === feed);
        assert(returnedFeed === feed);
        assert(sub.lastUpdatedAt === _.now());
      });
    });
  });
}
