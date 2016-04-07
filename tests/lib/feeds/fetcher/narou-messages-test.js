import { fixture } from "../../../common";
import FetcherNarouMessages from "../../../../app/scripts/lib/feeds/fetcher/narou-messages";
import fetcherTestCases from "./fetcher-test-cases";

fetcherTestCases({
  fetcher: () => new FetcherNarouMessages,
  itemsFixture: () => fixture.json("narou/my-message-list.json"),
});
