import { fixture } from "../../../common";
import FetcherKakuyomuNovels from "../../../../app/scripts/lib/feeds/fetcher/kakuyomu-novels";
import fetcherTestCases from "./fetcher-test-cases";

describe("FetcherKakuyomuNovels", () => {
  fetcherTestCases({
    fetcher: () => new FetcherKakuyomuNovels,
    itemsFixture: () => fixture.json("kakuyomu/my-novel-list.json"),
  });
});
