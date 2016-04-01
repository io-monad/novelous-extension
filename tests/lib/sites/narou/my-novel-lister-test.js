import { test, fixture, jsdom } from "../../../common";
import NarouMyNovelLister from "../../../../app/scripts/lib/sites/narou/my-novel-lister";

test.serial("#listNovels", async t => {
  await jsdom();
  mockjax({
    url: "http://syosetu.com/usernovel/list/",
    responseText: fixture("narou/my-novel-list.html"),
  });
  mockjax({
    url: "http://api.syosetu.com/novelapi/api/*",
    responseText: fixture("narou/novel-api/novel-many.json"),
  });

  const expected = JSON.parse(fixture("narou/my-novel-list.json"));
  const myNovelLister = new NarouMyNovelLister;
  return myNovelLister.listNovels().then((result) => {
    t.same(result, expected);
    t.pass();
  });
});
