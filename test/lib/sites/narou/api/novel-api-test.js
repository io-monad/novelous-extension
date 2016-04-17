import { assert, fixture } from "../../../../common";
import NarouNovelAPI from
  "../../../../../app/scripts/lib/sites/narou/api/novel-api";

describe("NarouNovelAPI", () => {
  describe("#getNovelById", () => {
    it("returns a Promise of novel info", () => {
      const expected = fixture.json("narou/novel-api/expected-novel.json");
      const novelAPI = new NarouNovelAPI;
      return novelAPI.getNovelById("n5191dd").then((novel) => {
        assert.deepEqual(novel, expected);
      });
    });
  });

  describe("#getNovelsByIds", () => {
    it("returns a Promise of list of novels", () => {
      const expected = fixture.json("narou/novel-api/expected-novels.json");
      const novelAPI = new NarouNovelAPI;
      return novelAPI.getNovelsByIds(["n5191dd", "n3861ci"]).then((novels) => {
        assert.deepEqual(novels, expected);
      });
    });
  });

  describe("#getNovelsByUserId", () => {
    it("returns a Promise of list of novels", () => {
      const expected = fixture.json("narou/novel-api/expected-result.json");
      const novelAPI = new NarouNovelAPI;
      return novelAPI.getNovelsByUserId(518056).then((result) => {
        assert.deepEqual(result, expected);
      });
    });
  });
});
