import { assert, fixture } from "../../../../common";
import NarouMyNovelLister from
  "../../../../../app/scripts/lib/sites/narou/api/my-novel-lister";

describe("NarouMyNovelLister", () => {
  describe("#listNovels", () => {
    it("returns a Promise of list of novels", () => {
      const expected = fixture.json("narou/my-novel-list.json");
      const myNovelLister = new NarouMyNovelLister;
      chrome.cookies.get.callsArgWithAsync(1, {});
      return myNovelLister.listNovels().then((result) => {
        assert.deepEqual(result, expected);
      });
    });
  });
});
