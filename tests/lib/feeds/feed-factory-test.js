import { test } from "../../common";
import FeedFactory from "../../../app/scripts/lib/feeds/feed-factory";
import NarouMessagesFeed from "../../../app/scripts/lib/feeds/narou-messages";

test("#create returns Feed", t => {
  const feed = FeedFactory.create("narou-messages", {});
  t.ok(feed instanceof NarouMessagesFeed);
});
test("#create throws Error for unknown feed name", t => {
  t.throws(
    () => { FeedFactory.create("nonexist"); },
    "Unknown feed name: nonexist"
  );
});
