import { parse } from "url";
import fixture from "./test-utils/fixture-loader";

export default {
  "https://kakuyomu.jp/my":
    "kakuyomu/my.html",
  "https://kakuyomu.jp/works/4852201425154996024":
    "kakuyomu/original-novel.html",
  "https://kakuyomu.jp/users/kadokawabooks/works":
    "kakuyomu/user-novel-list.html",

  "http://ncode.syosetu.com/novelview/infotop/ncode/n5191dd/":
    "narou/novel.html",
  "http://mypage.syosetu.com/mypage/novellist/userid/518056/":
    "narou/user-novel-list.html",
  "http://syosetu.com/usernovel/list/":
    "narou/my-novel-list.html",
  "http://syosetu.com/messagebox/top/":
    "narou/my-message-list.html",
  "http://syosetu.com/usernovelimpression/passivelist/":
    "narou/my-comment-list.html",
  "http://syosetu.com/usernovelreview/passivelist/":
    "narou/my-review-list.html",
  "http://syosetu.com/userblog/passivelist/":
    "narou/my-blog-comment-list.html",

  "http://api.syosetu.com/novelapi/api/*": (xhr) => {
    const { query } = parse(xhr.url, true);
    let body;
    if (query.ncode && query.ncode.indexOf("-") === -1) {
      body = fixture("narou/novel-api/novel-one.json");
    } else {
      body = fixture("narou/novel-api/novel-many.json");
    }
    return [200, { "Content-Type": "application/json" }, body];
  },
};
