import { test, fixture } from "../../../../common";
import KakuyomuMyUserFetcher from
  "../../../../../app/scripts/lib/sites/kakuyomu/api/my-user-fetcher";

test("#fetchUser", t => {
  const expected = fixture.json("kakuyomu/my-user.json");
  const userFetcher = new KakuyomuMyUserFetcher;
  return userFetcher.fetchUser().then((user) => {
    t.deepEqual(user, expected);
  });
});
