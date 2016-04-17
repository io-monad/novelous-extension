import { fixture } from "../../../common";
import FetcherNarouBlogComments from
  "../../../../app/scripts/lib/feeds/fetcher/narou-blog-comments";
import fetcherTestCases from "./fetcher-test-cases";

describe("FetcherNarouBlogComments", () => {
  fetcherTestCases({
    fetcher: () => new FetcherNarouBlogComments,
    itemsFixture: () => fixture.json("narou/my-blog-comment-list.json"),
  });
});
