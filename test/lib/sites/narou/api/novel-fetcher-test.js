import { assert, fixture } from "../../../../common";
import NarouNovelFetcher from
  "../../../../../app/scripts/lib/sites/narou/api/novel-fetcher";

describe("NarouNovelFetcher", () => {
  describe("#fetchNovel", () => {
    it("returns a Promise of novel info", () => {
      const expected = fixture.json("narou/novel.json");
      const novelFetcher = new NarouNovelFetcher;
      return novelFetcher.fetchNovel("n5191dd").then((novel) => {
        assert.deepEqual(novel, expected);
      });
    });
  });
});
