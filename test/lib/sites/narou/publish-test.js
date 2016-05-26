import { _, assert, factory } from "../../../common";
import publish from "../../../../app/scripts/lib/sites/narou/publish";

describe("NarouPublish", () => {
  let pub;
  let publishUrl;
  before(() => {
    pub = factory.buildSync("publication");
    publishUrl = `http://syosetu.com/usernovelmanage/ziwainput/ncode/${pub.sites.narou.novelId}/`;
  });

  it("opens a new tab with publication contents", () => {
    chrome.tabs.query.yieldsAsync([]);
    chrome.tabs.create.yieldsAsync({ id: 123 });
    chrome.tabs.executeScript.yieldsAsync([null]);

    return publish(pub).then(() => {
      assert(chrome.tabs.query.calledOnce === true);
      assert.deepEqual(chrome.tabs.query.args[0][0], { url: publishUrl });

      assert(chrome.tabs.create.calledOnce === true);
      assert.deepEqual(chrome.tabs.create.args[0][0], { url: publishUrl });

      assert(chrome.tabs.executeScript.calledOnce === true);
      assert(chrome.tabs.executeScript.args[0][0] === 123);
      assert(_.isString(chrome.tabs.executeScript.args[0][1].code));

      const code = chrome.tabs.executeScript.args[0][1].code;
      const embedPub = JSON.parse(code.match(/var pub = (.+?);/)[1]);
      assert.deepEqual(embedPub, {
        title: pub.title,
        body: pub.body,
        date: "2016年3月1日",
        hour: "11",
      });
    });
  });

  it("updates an existing tab with publication contents", () => {
    chrome.tabs.query.yieldsAsync([{ id: 123 }]);
    chrome.tabs.update.yieldsAsync({ id: 123 });
    chrome.tabs.executeScript.yieldsAsync([null]);

    return publish(pub).then(() => {
      assert(chrome.tabs.query.calledOnce === true);
      assert.deepEqual(chrome.tabs.query.args[0][0], { url: publishUrl });

      assert(chrome.tabs.update.calledOnce === true);
      assert(chrome.tabs.update.args[0][0] === 123);
      assert.deepEqual(chrome.tabs.update.args[0][1], { active: true });

      assert(chrome.tabs.executeScript.calledOnce === true);
      assert(chrome.tabs.executeScript.args[0][0] === 123);
      assert(_.isString(chrome.tabs.executeScript.args[0][1].code));

      const code = chrome.tabs.executeScript.args[0][1].code;
      const embedPub = JSON.parse(code.match(/var pub = (.+?);/)[1]);
      assert.deepEqual(embedPub, {
        title: pub.title,
        body: pub.body,
        date: "2016年3月1日",
        hour: "11",
      });
    });
  });
});
