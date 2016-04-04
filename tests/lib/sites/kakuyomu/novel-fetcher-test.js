import { test, fixture } from "../../../common";
import KakuyomuNovelFetcher from "../../../../app/scripts/lib/sites/kakuyomu/novel-fetcher";

test("#fetchNovel", t => {
  const expected = fixture.json("kakuyomu/original-novel.json");
  const novelFetcher = new KakuyomuNovelFetcher;
  return novelFetcher.fetchNovel("4852201425154996024").then((novel) => {
    t.same(novel, expected);
  });
});
