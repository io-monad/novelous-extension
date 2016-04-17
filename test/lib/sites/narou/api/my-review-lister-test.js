import { assert, fixture } from "../../../../common";
import NarouMyReviewLister from
  "../../../../../app/scripts/lib/sites/narou/api/my-review-lister";

describe("NarouMyReviewLister", () => {
  describe("#listReceivedReviews", () => {
    it("returns a Promise of list of reviews", () => {
      const expected = fixture.json("narou/my-review-list.json");
      const myReviewLister = new NarouMyReviewLister;
      chrome.cookies.get.callsArgWithAsync(1, {});
      return myReviewLister.listReceivedReviews().then((reviews) => {
        assert.deepEqual(reviews, expected);
      });
    });
  });
});
