import { test, fixture, jsdom } from "../../../common";
import NarouUserNovelLister from "../../../../app/scripts/lib/sites/narou/user-novel-lister";
import expectedList from "../../../fixtures/narou/user-novel-list.json";

test.serial("#listNovelsOfUser", async t => {
  await jsdom();
  mockjax({
    url: "http://mypage.syosetu.com/mypage/novellist/userid/518056/",
    responseText: fixture("narou/user-novel-list.html"),
  });

  const userNovelLister = new NarouUserNovelLister;
  return userNovelLister.listNovelsOfUser("518056").then((result) => {
    t.same(result, expectedList);
  });
});
