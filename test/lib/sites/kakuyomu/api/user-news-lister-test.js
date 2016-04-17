import { assert, fixture } from "../../../../common";
import KakuyomuUserNewsLister from
  "../../../../../app/scripts/lib/sites/kakuyomu/api/user-news-lister";

describe("KakuyomuUserNewsLister", () => {
  describe("#listNewsOfUser", () => {
    it("returns a Promise of list of news", () => {
      const expected = fixture.json("kakuyomu/user-news-list.json");
      const userNewsLister = new KakuyomuUserNewsLister;
      return userNewsLister.listNewsOfUser("io-monad").then((result) => {
        assert.deepEqual(result, expected);
      });
    });
  });
});
