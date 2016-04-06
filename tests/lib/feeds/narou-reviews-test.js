import { fixture } from "../../common";
import feedTestCases from "./feed-test-cases";
import NarouReviewsFeed from "../../../app/scripts/lib/feeds/narou-reviews";

feedTestCases({
  feed: () => new NarouReviewsFeed,
  itemsFixture: () => fixture.json("narou/my-review-list.json"),
});
