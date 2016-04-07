import { test, fixture } from "../../../common";
import KakuyomuUserNovelLister from "../../../../app/scripts/lib/sites/kakuyomu/user-novel-lister";

test("#listNovelsOfUser", t => {
  const expected = fixture.json("kakuyomu/user-novel-list.json");
  const userNovelLister = new KakuyomuUserNovelLister;
  return userNovelLister.listNovelsOfUser("kadokawabooks").then((result) => {
    t.deepEqual(result, expected);
  });
});
