import { assert, fixture } from "../../../../common";
import KakuyomuUserNovelLister from
  "../../../../../app/scripts/lib/sites/kakuyomu/api/user-novel-lister";

describe("KakuyomuUserNovelLister", () => {
  describe("#listNovelsOfUser", () => {
    it("returns a Promise of list of novels", () => {
      const expected = fixture.json("kakuyomu/user-novel-list.json");
      const userNovelLister = new KakuyomuUserNovelLister;
      return userNovelLister.listNovelsOfUser("kadokawabooks").then((result) => {
        assert.deepEqual(result, expected);
      });
    });
  });
});
