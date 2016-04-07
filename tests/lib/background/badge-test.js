import { test } from "../../common";
import Badge from "../../../app/scripts/lib/background/badge";

test("new Badge", t => {
  t.truthy(new Badge instanceof Badge);
});

test("#setCount with 0 sets empty badge text", t => {
  const badge = new Badge;
  badge.setCount(0);
  t.true(chrome.browserAction.setBadgeText.callCount === 1);
  t.deepEqual(chrome.browserAction.setBadgeText.args[0][0], { text: "" });
});

test("#setCount with N > 1 sets badge text to N", t => {
  const badge = new Badge;
  badge.setCount(1);
  t.true(chrome.browserAction.setBadgeText.callCount === 1);
  t.deepEqual(chrome.browserAction.setBadgeText.args[0][0], { text: "1" });

  badge.setCount(3);
  t.true(chrome.browserAction.setBadgeText.callCount === 2);
  t.deepEqual(chrome.browserAction.setBadgeText.args[1][0], { text: "3" });
});
