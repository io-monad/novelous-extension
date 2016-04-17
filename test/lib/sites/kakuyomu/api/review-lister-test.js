import { assert, fixture } from "../../../../common";
import KakuyomuReviewLister from
  "../../../../../app/scripts/lib/sites/kakuyomu/api/review-lister";

describe("KakuyomuReviewLister", () => {
  describe("#listReviews", () => {
    it("returns a Promise of list of reviews", () => {
      const expected = fixture.json("kakuyomu/review-list.json");
      const reviewLister = new KakuyomuReviewLister;
      return reviewLister.listReviews("4852201425154996024").then((result) => {
        assert.deepEqual(result, expected);
      });
    });
  });
});
