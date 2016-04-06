import { fixture } from "../../common";
import feedTestCases from "./feed-test-cases";
import NarouCommentsFeed from "../../../app/scripts/lib/feeds/narou-comments";

feedTestCases({
  feed: () => new NarouCommentsFeed,
  itemsFixture: () => fixture.json("narou/my-comment-list.json"),
});
