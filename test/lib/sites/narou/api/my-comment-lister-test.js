import { assert, fixture } from "../../../../common";
import NarouMyCommentLister from
  "../../../../../app/scripts/lib/sites/narou/api/my-comment-lister";

describe("NarouMyCommentLister", () => {
  describe("#listReceivedComments", () => {
    it("returns a Promise of list of comments", () => {
      const expected = fixture.json("narou/my-comment-list.json");
      const myCommentLister = new NarouMyCommentLister;
      chrome.cookies.get.callsArgWithAsync(1, {});
      return myCommentLister.listReceivedComments().then((comments) => {
        assert.deepEqual(comments, expected);
      });
    });
  });
});
