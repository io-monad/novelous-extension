import { _, assert } from "../../../common";
import NarouURL from "../../../../app/scripts/lib/sites/narou/url";

describe("NarouURL", () => {
  describe("#resolve", () => {
    it("returns resolved URL", () => {
      const resolved = NarouURL.resolve("/abc");
      assert(resolved === "http://syosetu.com/abc");
    });
  });

  describe("#isLoginFormURL", () => {
    it("returns whether the url is login form", () => {
      assert(NarouURL.isLoginFormURL(NarouURL.getLoginFormURL()));
      assert(!NarouURL.isLoginFormURL(NarouURL.getTopURL()));
    });
  });

  describe("#isLoginRequiredURL", () => {
    it("returns whether the url requires login", () => {
      assert(NarouURL.isLoginRequiredURL(NarouURL.getMyNovelsURL()));
      assert(!NarouURL.isLoginRequiredURL(NarouURL.getTopURL()));
    });
  });

  [
    ["getBaseURL"],
    ["getTopURL"],
    ["getLoginFormURL"],
    ["getMyNovelsURL"],
    ["getMyReceivedCommentsURL"],
    ["getMyReceivedReviewsURL"],
    ["getMyReceivedMessagesURL"],
    ["getMyReceivedBlogCommentsURL"],
    ["getNewEpisodeFormURL", "12345"],
    ["getNovelURL", "n12345"],
    ["getNovelInfoURL", "n12345"],
    ["getUserTopURL", "12345"],
    ["getUserNovelsURL", "12345"],
    ["getNovelAPIURL"],
  ]
  .forEach(([method, ...args]) => {
    describe(`#${method}`, () => {
      it("returns URL", () => {
        const got = NarouURL[method].apply(NarouURL, args);
        assert(_.isString(got));
        assert(/^https?:\/\//.test(got));
      });
    });
  });
});
