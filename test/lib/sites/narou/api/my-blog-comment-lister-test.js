import { assert, fixture } from "../../../../common";
import NarouMyBlogCommentLister from
  "../../../../../app/scripts/lib/sites/narou/api/my-blog-comment-lister";

describe("NarouMyBlogCommentLister", () => {
  describe("#listReceivedComments", () => {
    it("returns a Promise of list of blog comments", () => {
      const expected = fixture.json("narou/my-blog-comment-list.json");
      const myCommentLister = new NarouMyBlogCommentLister;
      chrome.cookies.get.callsArgWithAsync(1, {});
      return myCommentLister.listReceivedComments().then((comments) => {
        assert.deepEqual(comments, expected);
      });
    });
  });
});
