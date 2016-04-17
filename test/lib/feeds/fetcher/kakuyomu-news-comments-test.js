import { fixture } from "../../../common";
import FetcherKakuyomuNewsComments from
  "../../../../app/scripts/lib/feeds/fetcher/kakuyomu-news-comments";
import fetcherTestCases from "./fetcher-test-cases";

describe("FetcherKakuyomuNewsComments", () => {
  const news = fixture.json("kakuyomu/user-news-list.json");

  fetcherTestCases({
    fetcher: () => new FetcherKakuyomuNewsComments,
    itemsFixture: () => [
      { id: `${news[0].id}-${news[0].commentCount}` },
    ],
  });
});
