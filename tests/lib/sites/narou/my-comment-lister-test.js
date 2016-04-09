import { test, fixture } from "../../../common";
import NarouMyCommentLister from "../../../../app/scripts/lib/sites/narou/my-comment-lister";

test("#listReceivedComments", t => {
  const expected = fixture.json("narou/my-comment-list.json");
  const myCommentLister = new NarouMyCommentLister;
  chrome.cookies.get.callsArgWithAsync(1, {});
  return myCommentLister.listReceivedComments().then((comments) => {
    t.deepEqual(comments, expected);
  });
});
