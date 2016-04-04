import { test, fixture, jsdom } from "../../../common";
import KakuyomuMyNovelLister from "../../../../app/scripts/lib/sites/kakuyomu/my-novel-lister";

test.serial("#listNovels with fetchDetails = false", async t => {
  await jsdom();
  mockjax({
    url: "https://kakuyomu.jp/my",
    responseText: fixture("kakuyomu/my.html"),
  });

  const expected = JSON.parse(fixture("kakuyomu/my-novel-list.json"));
  const myNovelLister = new KakuyomuMyNovelLister({ fetchDetails: false });
  return myNovelLister.listNovels().then((novels) => {
    t.same(novels, expected);
  });
});

test.serial("#listNovels with fetchDetails = true", async t => {
  await jsdom();
  mockjax({
    url: "https://kakuyomu.jp/my",
    responseText: fixture("kakuyomu/my.html"),
  });
  mockjax({
    url: "https://kakuyomu.jp/works/4852201425154996024",
    responseText: fixture("kakuyomu/original-novel.html"),
  });

  const expected = JSON.parse(fixture("kakuyomu/my-novel-list-detailed.json"));
  const myNovelLister = new KakuyomuMyNovelLister({ fetchDetails: true, fetchInterval: 0 });
  return myNovelLister.listNovels().then((novels) => {
    t.same(novels, expected);
  });
});
