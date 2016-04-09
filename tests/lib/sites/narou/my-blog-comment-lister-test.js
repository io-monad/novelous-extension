import { test, fixture } from "../../../common";
import NarouMyBlogCommentLister from
  "../../../../app/scripts/lib/sites/narou/my-blog-comment-lister";

test("#listReceivedComments", t => {
  const expected = fixture.json("narou/my-blog-comment-list.json");
  const myCommentLister = new NarouMyBlogCommentLister;
  chrome.cookies.get.callsArgWithAsync(1, {});
  return myCommentLister.listReceivedComments().then((comments) => {
    t.deepEqual(comments, expected);
  });
});
