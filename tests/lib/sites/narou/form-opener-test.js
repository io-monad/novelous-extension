import { test, factory } from "../../../common";
import NarouFormOpener from "../../../../app/scripts/lib/sites/narou/form-opener";

test("#openForm", t => {
  const formOpener = new NarouFormOpener;
  const pub = factory.buildSync("publication");
  chrome.tabs.create.callsArgWithAsync(1, { id: 123 });
  chrome.tabs.executeScript.callsArgWithAsync(2, [null]);

  return formOpener.openForm(pub).then(() => {
    t.true(chrome.tabs.create.calledOnce);
    t.deepEqual(chrome.tabs.create.args[0][0], {
      url: `http://syosetu.com/usernovelmanage/ziwainput/ncode/${pub.sites.narou.novelId}/`,
    });
    t.true(chrome.tabs.executeScript.calledOnce);
    t.is(chrome.tabs.executeScript.args[0][0], 123);
    t.truthy(_.isString(chrome.tabs.executeScript.args[0][1].code));

    const code = chrome.tabs.executeScript.args[0][1].code;
    const formValue = (name) => {
      const re = new RegExp(`form\\.${name}\\.value = (.+?);`);
      return JSON.parse(code.match(re)[1]);
    };

    t.is(formValue("subtitle"), pub.title);
    t.is(formValue("novel"), pub.body);
    t.is(formValue("month"), "2016-03");
    t.is(formValue("day"), "1");
    t.is(formValue("hour"), "11");
  });
});
