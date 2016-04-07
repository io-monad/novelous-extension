import { fixture } from "../../../common";
import FetcherNarouReviews from "../../../../app/scripts/lib/feeds/fetcher/narou-reviews";
import fetcherTestCases from "./fetcher-test-cases";

fetcherTestCases({
  fetcher: () => new FetcherNarouReviews,
  itemsFixture: () => fixture.json("narou/my-review-list.json"),
});
