import { fixture } from "../../common";
import feedTestCases from "./feed-test-cases";
import NarouMessagesFeed from "../../../app/scripts/lib/feeds/narou-messages";

feedTestCases({
  feed: () => new NarouMessagesFeed,
  itemsFixture: () => fixture.json("narou/my-message-list.json"),
});
