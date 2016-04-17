import { _, assert } from "../../../common";
import KakuyomuURL from "../../../../app/scripts/lib/sites/kakuyomu/url";

describe("KakuyomuURL", () => {
  describe("#resolve", () => {
    it("returns resolved URL", () => {
      const resolved = KakuyomuURL.resolve("/abc");
      assert(resolved === "https://kakuyomu.jp/abc");
    });
  });

  describe("#isLoginFormURL", () => {
    it("returns whether the url is a login form", () => {
      assert(KakuyomuURL.isLoginFormURL(KakuyomuURL.getLoginFormURL()));
      assert(!KakuyomuURL.isLoginFormURL(KakuyomuURL.getTopURL()));
    });
  });

  describe("#isLoginRequiredURL", () => {
    it("returns whether the url requires login", () => {
      assert(KakuyomuURL.isLoginRequiredURL(KakuyomuURL.getMyTopURL()));
      assert(KakuyomuURL.isLoginRequiredURL(KakuyomuURL.getSettingsURL()));
      assert(!KakuyomuURL.isLoginRequiredURL(KakuyomuURL.getTopURL()));
    });
  });

  [
    ["getBaseURL"],
    ["getTopURL"],
    ["getMyTopURL"],
    ["getLoginFormURL"],
    ["getSettingsURL"],
    ["getNewEpisodeFormURL", "12345"],
    ["getNovelURL", "1234"],
    ["getNovelReviewsURL", "12345"],
    ["getUserNovelsURL", "12345"],
    ["getUserNewsURL", "12345"],
  ]
  .forEach(([method, ...args]) => {
    describe(`#${method}`, () => {
      it("returns URL", () => {
        const got = KakuyomuURL[method].apply(KakuyomuURL, args);
        assert(_.isString(got));
        assert(/^https?:\/\//.test(got));
      });
    });
  });
});
