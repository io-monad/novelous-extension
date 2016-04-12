import { fixture } from "../../../common";
import FetcherKakuyomuReviews from "../../../../app/scripts/lib/feeds/fetcher/kakuyomu-reviews";
import fetcherTestCases from "./fetcher-test-cases";

fetcherTestCases({
  fetcher: () => new FetcherKakuyomuReviews,
  itemsFixture: () => fixture.json("kakuyomu/original-novel.json").reviews,
});
