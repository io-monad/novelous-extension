import { test, fixture, jsdom } from "../../../common";
import NarouMyReviewLister from "../../../../app/scripts/lib/sites/narou/my-review-lister";

test.serial("#listReceivedReviews", async t => {
  await jsdom();
  mockjax({
    url: "http://syosetu.com/usernovelreview/passivelist/",
    responseText: fixture("narou/my-review-list.html"),
  });

  const expected = JSON.parse(fixture("narou/my-review-list.json"));
  const myReviewLister = new NarouMyReviewLister;
  return myReviewLister.listReceivedReviews().then((reviews) => {
    t.same(reviews, expected);
    t.pass();
  });
});
