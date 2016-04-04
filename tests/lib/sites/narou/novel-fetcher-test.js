import { test, fixture } from "../../../common";
import NarouNovelFetcher from "../../../../app/scripts/lib/sites/narou/novel-fetcher";

test("#fetchNovel", t => {
  const expected = fixture.json("narou/novel.json");
  const novelFetcher = new NarouNovelFetcher;
  return novelFetcher.fetchNovel("n5191dd").then((novel) => {
    t.same(novel, expected);
  });
});
