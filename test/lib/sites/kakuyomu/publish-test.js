import { _, assert, factory } from "../../../common";
import publish from "../../../../app/scripts/lib/sites/kakuyomu/publish";

describe("KakuyomuPublish", () => {
  it("publishes novel to sites", () => {
    const pub = factory.buildSync("publication", {
      sites: {
        kakuyomu: { novelId: "12341234" },
      },
    });
    chrome.tabs.create.callsArgWithAsync(1, { id: 123 });
    chrome.tabs.executeScript.callsArgWithAsync(2, [null]);

    return publish(pub).then(() => {
      assert(chrome.tabs.create.calledOnce);
      assert.deepEqual(chrome.tabs.create.args[0][0], {
        url: `https://kakuyomu.jp/my/works/${pub.sites.kakuyomu.novelId}/episodes/new`,
      });
      assert(chrome.tabs.executeScript.calledOnce);
      assert(chrome.tabs.executeScript.args[0][0] === 123);
      assert(_.isString(chrome.tabs.executeScript.args[0][1].code));

      const code = chrome.tabs.executeScript.args[0][1].code;
      const formValue = (name) => {
        const re = new RegExp(`form\\.${name}\\.value = (.+?);`);
        return JSON.parse(code.match(re)[1]);
      };

      assert(formValue("title") === pub.title);
      assert(formValue("body") === pub.body);
      assert(formValue("reservation_date") === "2016-03-01");
      assert(formValue("reservation_time") === "11:34");
    });
  });
});
