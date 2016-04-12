import { test, fixture } from "../../../../common";
import NarouMyNovelLister from
  "../../../../../app/scripts/lib/sites/narou/api/my-novel-lister";

test("#listNovels", t => {
  const expected = fixture.json("narou/my-novel-list.json");
  const myNovelLister = new NarouMyNovelLister;
  chrome.cookies.get.callsArgWithAsync(1, {});
  return myNovelLister.listNovels().then((result) => {
    t.deepEqual(result, expected);
  });
});
