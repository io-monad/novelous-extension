import { test, fixture } from "../../../../common";
import KakuyomuUserNewsLister from
  "../../../../../app/scripts/lib/sites/kakuyomu/api/user-news-lister";

test("#listNewsOfUser", t => {
  const expected = fixture.json("kakuyomu/user-news-list.json");
  const userNewsLister = new KakuyomuUserNewsLister;
  return userNewsLister.listNewsOfUser("io-monad").then((result) => {
    t.deepEqual(result, expected);
  });
});
