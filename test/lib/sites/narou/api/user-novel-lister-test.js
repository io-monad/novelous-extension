import { assert, fixture } from "../../../../common";
import NarouUserNovelLister from
  "../../../../../app/scripts/lib/sites/narou/api/user-novel-lister";

describe("NarouUserNovelLister", () => {
  describe("#listNovelsOfUser", () => {
    it("returns a Promise of list of novels", () => {
      const expected = fixture.json("narou/user-novel-list.json");
      const userNovelLister = new NarouUserNovelLister;
      return userNovelLister.listNovelsOfUser("518056").then((result) => {
        assert.deepEqual(result, expected);
      });
    });
  });
});
