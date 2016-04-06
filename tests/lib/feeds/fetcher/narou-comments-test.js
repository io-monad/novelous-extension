import { fixture } from "../../../common";
import fetcherTestCases from "./fetcher-test-cases";
import FetcherNarouComments from "../../../../app/scripts/lib/feeds/fetcher/narou-comments";

fetcherTestCases({
  fetcher: () => new FetcherNarouComments,
  itemsFixture: () => fixture.json("narou/my-comment-list.json"),
});
