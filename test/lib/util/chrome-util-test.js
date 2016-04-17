import { assert, sinon } from "../../common";
import cutil from "../../../app/scripts/lib/util/chrome-util";

describe("ChromeUtil", () => {
  describe("#withActiveTab", () => {
    it("returns active tab", (done) => {
      const tabs = [{ id: 123 }];
      chrome.tabs.query.callsArgWithAsync(1, tabs);
      cutil.withActiveTab((given) => {
        assert.deepEqual(given, tabs[0]);
        done();
      });
    });
  });

  describe("#withTab", () => {
    it("returns specific tab", () => {
      const tab = { id: 123 };
      const spy = sinon.spy();
      cutil.withTab(tab.id, spy);
      assert(chrome.tabs.get.called);
    });
  });
});
