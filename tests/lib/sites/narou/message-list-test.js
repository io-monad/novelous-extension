import { test, fixture, jsdom } from "../../../common";
import NarouMessageLister from "../../../../app/scripts/lib/sites/narou/message-lister";
import NarouMessageType from "../../../../app/scripts/lib/sites/narou/message-type";
import expectedReceivedList from "../../../fixtures/narou/received-message-list.json";

test.serial("#listMessages", async t => {
  await jsdom();
  mockjax({
    url: "http://syosetu.com/messagebox/top/nowfolder/2/",
    responseText: fixture("narou/received-message-list.html"),
  });

  const messageLister = new NarouMessageLister;
  return messageLister.listMessages(NarouMessageType.RECEIVED).then((result) => {
    t.same(result, expectedReceivedList);
    t.pass();
  });
});
