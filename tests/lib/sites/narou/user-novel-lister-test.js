import { test, fixture } from "../../../common";
import NarouUserNovelLister from "../../../../app/scripts/lib/sites/narou/user-novel-lister";

test("#listNovelsOfUser", t => {
  const expected = fixture.json("narou/user-novel-list.json");
  const userNovelLister = new NarouUserNovelLister;
  return userNovelLister.listNovelsOfUser("518056").then((result) => {
    t.deepEqual(result, expected);
  });
});
