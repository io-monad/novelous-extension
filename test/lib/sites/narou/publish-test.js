import { _, assert, factory } from "../../../common";
import publish from "../../../../app/scripts/lib/sites/narou/publish";

describe("NarouPublish", () => {
  it("publishes novel to sites", () => {
    const pub = factory.buildSync("publication");
    chrome.tabs.create.callsArgWithAsync(1, { id: 123 });
    chrome.tabs.executeScript.callsArgWithAsync(2, [null]);

    return publish(pub).then(() => {
      assert(chrome.tabs.create.calledOnce);
      assert.deepEqual(chrome.tabs.create.args[0][0], {
        url: `http://syosetu.com/usernovelmanage/ziwainput/ncode/${pub.sites.narou.novelId}/`,
      });
      assert(chrome.tabs.executeScript.calledOnce);
      assert(chrome.tabs.executeScript.args[0][0] === 123);
      assert(_.isString(chrome.tabs.executeScript.args[0][1].code));

      const code = chrome.tabs.executeScript.args[0][1].code;
      const formValue = (name) => {
        const re = new RegExp(`form\\.${name}\\.value = (.+?);`);
        return JSON.parse(code.match(re)[1]);
      };

      assert(formValue("subtitle") === pub.title);
      assert(formValue("novel") === pub.body);
      assert(formValue("month") === "2016-03");
      assert(formValue("day") === "1");
      assert(formValue("hour") === "11");
    });
  });
});
