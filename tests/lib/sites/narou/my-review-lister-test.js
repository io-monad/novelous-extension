import { test, fixture } from "../../../common";
import NarouMyReviewLister from "../../../../app/scripts/lib/sites/narou/my-review-lister";

test("#listReceivedReviews", t => {
  const expected = fixture.json("narou/my-review-list.json");
  const myReviewLister = new NarouMyReviewLister;
  chrome.cookies.get.callsArgWithAsync(1, {});
  return myReviewLister.listReceivedReviews().then((reviews) => {
    t.deepEqual(reviews, expected);
  });
});
