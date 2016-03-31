import { test, fixture, jsdom } from "../../../common";
import KakuyomuNovelFetcher from "../../../../app/scripts/lib/sites/kakuyomu/novel-fetcher";
import expectedNovel from "../../../fixtures/kakuyomu/original-novel.json";

test.serial("#fetchNovel", async t => {
  await jsdom();
  mockjax({
    url: "https://kakuyomu.jp/works/4852201425154996024",
    responseText: fixture("kakuyomu/original-novel.html"),
  });

  const novelFetcher = new KakuyomuNovelFetcher;
  return novelFetcher.fetchNovel("4852201425154996024").then((novel) => {
    t.same(novel, expectedNovel);
    t.pass();
  });
});
