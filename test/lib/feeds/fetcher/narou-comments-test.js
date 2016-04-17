import { fixture } from "../../../common";
import FetcherNarouComments from "../../../../app/scripts/lib/feeds/fetcher/narou-comments";
import fetcherTestCases from "./fetcher-test-cases";

describe("FetcherNarouComments", () => {
  fetcherTestCases({
    fetcher: () => new FetcherNarouComments,
    itemsFixture: () => fixture.json("narou/my-comment-list.json"),
  });
});
