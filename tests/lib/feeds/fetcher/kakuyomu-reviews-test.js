import { fixture } from "../../../common";
import fetcherTestCases from "./fetcher-test-cases";
import FetcherKakuyomuReviews from "../../../../app/scripts/lib/feeds/fetcher/kakuyomu-reviews";

fetcherTestCases({
  fetcher: () => new FetcherKakuyomuReviews({ fetchInterval: 0 }),
  itemsFixture: () => fixture.json("kakuyomu/original-novel.json").reviews,
});
