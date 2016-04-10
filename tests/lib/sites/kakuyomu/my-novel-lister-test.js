import { test, fixture } from "../../../common";
import KakuyomuMyNovelLister from "../../../../app/scripts/lib/sites/kakuyomu/my-novel-lister";

test("#listNovelIds", t => {
  const expected = fixture.json("kakuyomu/my-novel-id-list.json");
  const myNovelLister = new KakuyomuMyNovelLister();
  chrome.cookies.get.callsArgWithAsync(1, {});
  return myNovelLister.listNovelIds().then((novels) => {
    t.deepEqual(novels, expected);
  });
});

test("#listNovels", t => {
  const expected = fixture.json("kakuyomu/my-novel-list.json");
  const myNovelLister = new KakuyomuMyNovelLister();
  chrome.cookies.get.callsArgWithAsync(1, {});
  return myNovelLister.listNovels().then((novels) => {
    t.deepEqual(novels, expected);
  });
});
