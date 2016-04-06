import { fixture } from "../../../common";
import fetcherTestCases from "./fetcher-test-cases";
import FetcherNarouReviews from "../../../../app/scripts/lib/feeds/fetcher/narou-reviews";

fetcherTestCases({
  fetcher: () => new FetcherNarouReviews,
  itemsFixture: () => fixture.json("narou/my-review-list.json"),
});
