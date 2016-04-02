import { test, fixture, jsdom } from "../../../common";
import KakuyomuMyNovelLister from "../../../../app/scripts/lib/sites/kakuyomu/my-novel-lister";

test.serial("#listNovels", async t => {
  await jsdom();
  mockjax({
    url: "https://kakuyomu.jp/my",
    responseText: fixture("kakuyomu/my.html"),
  });

  const expected = JSON.parse(fixture("kakuyomu/my-novel-list.json"));
  const myNovelLister = new KakuyomuMyNovelLister;
  return myNovelLister.listNovels().then((novels) => {
    t.same(novels, expected);
  });
});
