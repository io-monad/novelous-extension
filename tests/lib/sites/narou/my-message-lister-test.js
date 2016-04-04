import { test, fixture } from "../../../common";
import NarouMyMessageLister from "../../../../app/scripts/lib/sites/narou/my-message-lister";

test("#listReceivedMessages", t => {
  const expected = fixture.json("narou/my-message-list.json");
  const myMessageLister = new NarouMyMessageLister;
  return myMessageLister.listReceivedMessages().then((messages) => {
    t.same(messages, expected);
  });
});
