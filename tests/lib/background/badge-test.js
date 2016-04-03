import { test } from "../../common";
import Badge from "../../../app/scripts/lib/background/badge";

test("new Badge", t => {
  t.ok(new Badge instanceof Badge);
});

test("#update without counts sets empty badge text", t => {
  const badge = new Badge;
  badge.update();

  t.true(chrome.browserAction.setBadgeText.calledOnce);
  t.same(chrome.browserAction.setBadgeText.args[0][0], { text: "" });
});

test("#setCount sets sum of counts to badge text", t => {
  const badge = new Badge;
  badge.setCount("a", 1);
  t.true(chrome.browserAction.setBadgeText.callCount === 1);
  t.same(chrome.browserAction.setBadgeText.args[0][0], { text: "1" });

  badge.setCount("b", 2);
  t.true(chrome.browserAction.setBadgeText.callCount === 2);
  t.same(chrome.browserAction.setBadgeText.args[1][0], { text: "3" });

  badge.setCount("c", 3);
  t.true(chrome.browserAction.setBadgeText.callCount === 3);
  t.same(chrome.browserAction.setBadgeText.args[2][0], { text: "6" });
});

test("#setCount overwrites count for the same name", t => {
  const badge = new Badge;
  badge.setCount("a", 1);
  badge.setCount("b", 2);
  t.same(chrome.browserAction.setBadgeText.args[1][0], { text: "3" });

  badge.setCount("a", 3);
  t.same(chrome.browserAction.setBadgeText.args[2][0], { text: "5" });
});

test("#clear clears badge text and counts", t => {
  const badge = new Badge;
  badge.setCount("a", 1);
  badge.setCount("b", 2);
  t.same(chrome.browserAction.setBadgeText.args[1][0], { text: "3" });

  badge.clear();
  t.same(chrome.browserAction.setBadgeText.args[2][0], { text: "" });

  badge.setCount("a", 2);
  t.same(chrome.browserAction.setBadgeText.args[3][0], { text: "2" });
});
