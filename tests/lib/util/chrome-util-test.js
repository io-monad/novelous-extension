import { test, sinon } from "../../common";
import cutil from "../../../app/scripts/lib/util/chrome-util";

test.cb("#withActiveTab", t => {
  t.plan(1);
  const tabs = [{ id: 123 }];
  chrome.tabs.query.callsArgWithAsync(1, tabs);
  cutil.withActiveTab((given) => {
    t.deepEqual(given, tabs[0]);
    t.end();
  });
});

test("#withTab", t => {
  const tab = { id: 123 };
  const spy = sinon.spy();
  cutil.withTab(tab.id, spy);
  t.truthy(chrome.tabs.get.called);
});
