import { fixture } from "../../../common";
import FetcherKakuyomuNewsComments from
  "../../../../app/scripts/lib/feeds/fetcher/kakuyomu-news-comments";
import fetcherTestCases from "./fetcher-test-cases";

describe("FetcherKakuyomuNewsComments", () => {
  fetcherTestCases({
    fetcher: () => new FetcherKakuyomuNewsComments,
    itemsFixture: () => fixture.json("kakuyomu/my-news-comment-list.json"),
  });
});
