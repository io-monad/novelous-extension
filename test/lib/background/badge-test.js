import { assert } from "../../common";
import Badge from "../../../app/scripts/lib/background/badge";

describe("Badge", () => {
  it("new Badge", () => {
    assert(new Badge instanceof Badge);
  });

  describe("#setCount", () => {
    it("with 0 sets empty badge text", () => {
      const badge = new Badge;
      badge.setCount(0);
      assert(chrome.browserAction.setBadgeText.callCount === 1);
      assert.deepEqual(chrome.browserAction.setBadgeText.args[0][0], { text: "" });
    });

    it("with N > 1 sets badge text to N", () => {
      const badge = new Badge;
      badge.setCount(1);
      assert(chrome.browserAction.setBadgeText.callCount === 1);
      assert.deepEqual(chrome.browserAction.setBadgeText.args[0][0], { text: "1" });

      badge.setCount(3);
      assert(chrome.browserAction.setBadgeText.callCount === 2);
      assert.deepEqual(chrome.browserAction.setBadgeText.args[1][0], { text: "3" });
    });
  });
});
