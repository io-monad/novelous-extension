import { assert, fixture } from "../../../../common";
import NarouMyMessageLister from
  "../../../../../app/scripts/lib/sites/narou/api/my-message-lister";

describe("NarouMyMessageLister", () => {
  describe("#listReceivedMessages", () => {
    it("returns a Promise of list of messages", () => {
      const expected = fixture.json("narou/my-message-list.json");
      const myMessageLister = new NarouMyMessageLister;
      chrome.cookies.get.callsArgWithAsync(1, {});
      return myMessageLister.listReceivedMessages().then((messages) => {
        assert.deepEqual(messages, expected);
      });
    });
  });
});
