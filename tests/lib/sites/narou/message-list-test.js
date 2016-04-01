import { test, fixture, jsdom } from "../../../common";
import NarouMessageLister from "../../../../app/scripts/lib/sites/narou/message-lister";
import expectedList from "../../../fixtures/narou/message-list.json";

test.serial.only("#listMessages", async t => {
  await jsdom();
  mockjax({
    url: "http://syosetu.com/messagebox/top/",
    responseText: fixture("narou/message-list.html"),
  });

  const messageLister = new NarouMessageLister;
  return messageLister.listMessages().then((result) => {
    t.same(result, expectedList);
    t.pass();
  });
});
