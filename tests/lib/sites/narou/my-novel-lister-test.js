import { test, fixture } from "../../../common";
import NarouMyNovelLister from "../../../../app/scripts/lib/sites/narou/my-novel-lister";

test("#listNovels", t => {
  const expected = fixture.json("narou/my-novel-list.json");
  const myNovelLister = new NarouMyNovelLister;
  return myNovelLister.listNovels().then((result) => {
    t.same(result, expected);
  });
});
