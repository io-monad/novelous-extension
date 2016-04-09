import { test, fixture } from "../../../common";
import KakuyomuMyNovelLister from "../../../../app/scripts/lib/sites/kakuyomu/my-novel-lister";

test("#listNovels with fetchDetails = false", t => {
  const expected = fixture.json("kakuyomu/my-novel-list.json");
  const myNovelLister = new KakuyomuMyNovelLister({ fetchDetails: false });
  chrome.cookies.get.callsArgWithAsync(1, {});
  return myNovelLister.listNovels().then((novels) => {
    t.deepEqual(novels, expected);
  });
});

test("#listNovels with fetchDetails = true", t => {
  const expected = fixture.json("kakuyomu/my-novel-list-detailed.json");
  const myNovelLister = new KakuyomuMyNovelLister({ fetchDetails: true, fetchInterval: 0 });
  chrome.cookies.get.callsArgWithAsync(1, {});
  return myNovelLister.listNovels().then((novels) => {
    t.deepEqual(novels, expected);
  });
});
