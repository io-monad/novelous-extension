import { assert, fixture } from "../../../../common";
import KakuyomuMyNewsCommentLister from
  "../../../../../app/scripts/lib/sites/kakuyomu/api/my-news-comment-lister";

describe("KakuyomuMyNewsCommentLister", () => {
  describe("#listReceivedComments", () => {
    it("returns a Promise of received comments", () => {
      const expected = fixture.json("kakuyomu/my-news-comment-list.json");
      const newsCommentLister = new KakuyomuMyNewsCommentLister;
      return newsCommentLister.listReceivedComments().then((comments) => {
        assert.deepEqual(comments, expected);
      });
    });
  });
});
