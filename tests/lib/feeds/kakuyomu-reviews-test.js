import { fixture } from "../../common";
import feedTestCases from "./feed-test-cases";
import KakuyomuReviewsFeed from "../../../app/scripts/lib/feeds/kakuyomu-reviews";

feedTestCases({
  feed: () => new KakuyomuReviewsFeed({ options: { fetchInterval: 0 } }),
  itemsFixture: () => fixture.json("kakuyomu/original-novel.json").reviews,
});
