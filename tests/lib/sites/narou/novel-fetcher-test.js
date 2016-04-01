import { test, fixture, jsdom } from "../../../common";
import NarouNovelFetcher from "../../../../app/scripts/lib/sites/narou/novel-fetcher";
import expectedNovel from "../../../fixtures/narou/novel.json";

test.serial("#fetchNovel", async t => {
  await jsdom();
  mockjax({
    url: "http://ncode.syosetu.com/novelview/infotop/ncode/n5191dd/",
    responseText: fixture("narou/novel.html"),
  });

  const novelFetcher = new NarouNovelFetcher;
  return novelFetcher.fetchNovel("n5191dd").then((novel) => {
    t.same(novel, expectedNovel);
  });
});
