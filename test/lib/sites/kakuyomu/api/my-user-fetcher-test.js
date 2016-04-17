import { assert, fixture } from "../../../../common";
import KakuyomuMyUserFetcher from
  "../../../../../app/scripts/lib/sites/kakuyomu/api/my-user-fetcher";

describe("KakuyomuMyUserFetcher", () => {
  describe("#fetchUser", () => {
    it("returns a Promise of user info", () => {
      const expected = fixture.json("kakuyomu/my-user.json");
      const userFetcher = new KakuyomuMyUserFetcher;
      return userFetcher.fetchUser().then((user) => {
        assert.deepEqual(user, expected);
      });
    });
  });
});
