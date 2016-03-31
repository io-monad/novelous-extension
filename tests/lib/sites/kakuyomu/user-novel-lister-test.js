import { test, fixture, jsdom } from "../../../common";
import KakuyomuUserNovelLister from "../../../../app/scripts/lib/sites/kakuyomu/user-novel-lister";
import expectedList from "../../../fixtures/kakuyomu/user-novel-list.json";

test.serial("#listNovelsOfUser", async t => {
  await jsdom();
  mockjax({
    url: "https://kakuyomu.jp/users/kadokawabooks/works",
    responseText: fixture("kakuyomu/user-novel-list.html"),
  });

  const userNovelLister = new KakuyomuUserNovelLister;
  return userNovelLister.listNovelsOfUser("kadokawabooks").then((result) => {
    t.same(result, expectedList);
    t.pass();
  });
});
