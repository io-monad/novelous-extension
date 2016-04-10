import { test, fixture } from "../../../common";
import KakuyomuReviewLister from "../../../../app/scripts/lib/sites/kakuyomu/review-lister";

test("#listReviews", t => {
  const expected = fixture.json("kakuyomu/review-list.json");
  const reviewLister = new KakuyomuReviewLister;
  return reviewLister.listReviews("4852201425154996024").then((result) => {
    t.deepEqual(result, expected);
  });
});
