import { fixture } from "../../../common";
import fetcherTestCases from "./fetcher-test-cases";
import FetcherNarouMessages from "../../../../app/scripts/lib/feeds/fetcher/narou-messages";

fetcherTestCases({
  fetcher: () => new FetcherNarouMessages,
  itemsFixture: () => fixture.json("narou/my-message-list.json"),
});
