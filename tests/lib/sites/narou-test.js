import { test, factory } from "../../common";
import Narou from "../../../app/scripts/lib/sites/narou";
import strftime from "strftime";

test.beforeEach(t => {
  t.context.narou = new Narou;
});

test("new Narou", t => {
  const { narou } = t.context;
  t.ok(narou instanceof Narou);
  t.ok(_.isString(narou.name));
  t.ok(_.isString(narou.displayName));
  t.ok(_.isString(narou.baseUrl));
});

test("#publish", t => {
  const { narou } = t.context;
  const pub = factory.buildSync("publication");
  chrome.tabs.create.callsArgWithAsync(1, { id: 123 });
  chrome.tabs.executeScript.callsArgWithAsync(2, [null]);

  return narou.publish(pub).then(() => {
    t.true(chrome.tabs.create.calledOnce);
    t.same(chrome.tabs.create.args[0][0], {
      url: `http://syosetu.com/usernovelmanage/ziwainput/ncode/${pub.sites.narou.novelId}/`,
    });
    t.true(chrome.tabs.executeScript.calledOnce);
    t.is(chrome.tabs.executeScript.args[0][0], 123);
    t.ok(_.isString(chrome.tabs.executeScript.args[0][1].code));

    const code = chrome.tabs.executeScript.args[0][1].code;
    const formValue = (name) => {
      const re = new RegExp(`form\\.${name}\\.value = (.+?);`);
      return JSON.parse(code.match(re)[1]);
    };

    t.is(formValue("subtitle"), pub.title);
    t.is(formValue("novel"), pub.body);
    t.is(formValue("month"), strftime("%Y-%m", pub.time));
    t.is(formValue("day"), strftime("%-d", pub.time));
    t.is(formValue("hour"), strftime("%-H", pub.time));
  });
});
