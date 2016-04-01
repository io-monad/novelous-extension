import { test, fixture, jsdom } from "../../../common";
import NarouNovelAPI from "../../../../app/scripts/lib/sites/narou/novel-api";

test.serial("#getNovelById", async t => {
  await jsdom();
  mockjax({
    url: "http://api.syosetu.com/novelapi/api/*",
    responseText: fixture("narou/novel-api/novel-one.json"),
  });

  const expected = JSON.parse(fixture("narou/novel-api/expected-novel.json"));
  const novelAPI = new NarouNovelAPI;
  return novelAPI.getNovelById("n5191dd").then((novel) => {
    t.same(novel, expected);
  });
});

test.serial("#getNovelsByIds", async t => {
  await jsdom();
  mockjax({
    url: "http://api.syosetu.com/novelapi/api/*",
    responseText: fixture("narou/novel-api/novel-many.json"),
  });

  const expected = JSON.parse(fixture("narou/novel-api/expected-novels.json"));
  const novelAPI = new NarouNovelAPI;
  return novelAPI.getNovelsByIds(["n5191dd", "n3861ci"]).then((novels) => {
    t.same(novels, expected);
  });
});

test.serial("#getNovelsByUserId", async t => {
  await jsdom();
  mockjax({
    url: "http://api.syosetu.com/novelapi/api/*",
    responseText: fixture("narou/novel-api/novel-many.json"),
  });

  const expected = JSON.parse(fixture("narou/novel-api/expected-result.json"));
  const novelAPI = new NarouNovelAPI;
  return novelAPI.getNovelsByUserId(518056).then((result) => {
    t.same(result, expected);
  });
});
