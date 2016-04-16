import { _, test } from "../../../common";
import KakuyomuURL from "../../../../app/scripts/lib/sites/kakuyomu/url";

test("#resolve", t => {
  const resolved = KakuyomuURL.resolve("/abc");
  t.is(resolved, "https://kakuyomu.jp/abc");
});

test("#isLoginFormURL", t => {
  t.true(KakuyomuURL.isLoginFormURL(KakuyomuURL.getLoginFormURL()));
  t.false(KakuyomuURL.isLoginFormURL(KakuyomuURL.getTopURL()));
});

test("#isLoginRequiredURL", t => {
  t.true(KakuyomuURL.isLoginRequiredURL(KakuyomuURL.getMyTopURL()));
  t.true(KakuyomuURL.isLoginRequiredURL(KakuyomuURL.getSettingsURL()));
  t.false(KakuyomuURL.isLoginRequiredURL(KakuyomuURL.getTopURL()));
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
  test(`#${method}`, t => {
    const got = KakuyomuURL[method].apply(KakuyomuURL, args);
    t.true(_.isString(got));
    t.true(/^https?:\/\//.test(got));
  });
});
