import { assert, fixture } from "../../../../common";
import KakuyomuMyNovelLister from
  "../../../../../app/scripts/lib/sites/kakuyomu/api/my-novel-lister";

describe("KakuyomuMyNovelLister", () => {
  describe("#listNovelIds", () => {
    it("returns a Promise of list of novel IDs", () => {
      const expected = fixture.json("kakuyomu/my-novel-id-list.json");
      const myNovelLister = new KakuyomuMyNovelLister();
      chrome.cookies.get.callsArgWithAsync(1, {});
      return myNovelLister.listNovelIds().then((novels) => {
        assert.deepEqual(novels, expected);
      });
    });
  });

  describe("#listNovels", () => {
    it("return a Promise of list of novels", () => {
      const expected = fixture.json("kakuyomu/my-novel-list.json");
      const myNovelLister = new KakuyomuMyNovelLister();
      chrome.cookies.get.callsArgWithAsync(1, {});
      return myNovelLister.listNovels().then((novels) => {
        assert.deepEqual(novels, expected);
      });
    });
  });
});
