import { test, fixture, jsdom } from "../../../common";
import NarouMyCommentLister from "../../../../app/scripts/lib/sites/narou/my-comment-lister";

test.serial("#listReceivedComments", async t => {
  await jsdom();
  mockjax({
    url: "http://syosetu.com/usernovelimpression/passivelist/",
    responseText: fixture("narou/my-comment-list.html"),
  });

  const expected = JSON.parse(fixture("narou/my-comment-list.json"));
  const myCommentLister = new NarouMyCommentLister;
  return myCommentLister.listReceivedComments().then((comments) => {
    t.same(comments, expected);
    t.pass();
  });
});
