import { test } from "../../common";
import FetcherFactory from "../../../app/scripts/lib/feeds/fetcher-factory";
import FetcherNarouComments from "../../../app/scripts/lib/feeds/fetcher/narou-comments";

test("#create returns FeedFetcher", t => {
  const fetcher = FetcherFactory.create("novelous-feed://narou/comments");
  t.true(fetcher instanceof FetcherNarouComments);
});

test("#create throws Error for unknown protocol in feed url", t => {
  t.throws(
    () => { FetcherFactory.create("test://narou/messages"); },
    "Not supported protocol: test://narou/messages"
  );
});

test("#create throws Error for unknown novelous-feed: url", t => {
  t.throws(
    () => { FetcherFactory.create("novelous-feed://narou/nonexist"); },
    "Unknown novelous-feed URL: novelous-feed://narou/nonexist"
  );
});
