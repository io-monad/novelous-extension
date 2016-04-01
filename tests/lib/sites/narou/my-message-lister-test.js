import { test, fixture, jsdom } from "../../../common";
import NarouMyMessageLister from "../../../../app/scripts/lib/sites/narou/my-message-lister";

test.serial("#listReceivedMessages", async t => {
  await jsdom();
  mockjax({
    url: "http://syosetu.com/messagebox/top/",
    responseText: fixture("narou/my-message-list.html"),
  });

  const expected = JSON.parse(fixture("narou/my-message-list.json"));
  const myMessageLister = new NarouMyMessageLister;
  return myMessageLister.listReceivedMessages().then((messages) => {
    t.same(messages, expected);
  });
});
