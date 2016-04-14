import { fixture } from "../../../common";
import FetcherKakuyomuNovels from "../../../../app/scripts/lib/feeds/fetcher/kakuyomu-novels";
import fetcherTestCases from "./fetcher-test-cases";

fetcherTestCases({
  fetcher: () => new FetcherKakuyomuNovels,
  itemsFixture: () => fixture.json("kakuyomu/my-novel-list.json"),
});
