import { assert, fixture } from "../../../../common";
import KakuyomuNovelFetcher from
  "../../../../../app/scripts/lib/sites/kakuyomu/api/novel-fetcher";

describe("KakuyomuNovelFetcher", () => {
  describe("#fetchNovel", () => {
    it("returns a Promise of fetched novel", () => {
      const expected = fixture.json("kakuyomu/original-novel.json");
      const novelFetcher = new KakuyomuNovelFetcher;
      return novelFetcher.fetchNovel("4852201425154996024").then((novel) => {
        assert.deepEqual(novel, expected);
      });
    });
  });
});
