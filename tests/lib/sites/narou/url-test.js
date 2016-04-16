import { _, test } from "../../../common";
import NarouURL from "../../../../app/scripts/lib/sites/narou/url";

test("#resolve", t => {
  const resolved = NarouURL.resolve("/abc");
  t.is(resolved, "http://syosetu.com/abc");
});

test("#isLoginFormURL", t => {
  t.true(NarouURL.isLoginFormURL(NarouURL.getLoginFormURL()));
  t.false(NarouURL.isLoginFormURL(NarouURL.getTopURL()));
});

test("#isLoginRequiredURL", t => {
  t.true(NarouURL.isLoginRequiredURL(NarouURL.getMyNovelsURL()));
  t.false(NarouURL.isLoginRequiredURL(NarouURL.getTopURL()));
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
  test(`#${method}`, t => {
    const got = NarouURL[method].apply(NarouURL, args);
    t.true(_.isString(got));
    t.true(/^https?:\/\//.test(got));
  });
});
