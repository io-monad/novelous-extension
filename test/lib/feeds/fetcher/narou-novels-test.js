import { fixture } from "../../../common";
import FetcherNarouNovels from "../../../../app/scripts/lib/feeds/fetcher/narou-novels";
import fetcherTestCases from "./fetcher-test-cases";

describe("FetcherNarouNovels", () => {
  fetcherTestCases({
    fetcher: () => new FetcherNarouNovels,
    itemsFixture: () => fixture.json("narou/my-novel-list.json"),
  });
});
