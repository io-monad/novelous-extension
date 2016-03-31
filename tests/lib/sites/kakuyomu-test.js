import { test, factory } from "../../common";
import Kakuyomu from "../../../app/scripts/lib/sites/kakuyomu";
import strftime from "strftime";

test.beforeEach(t => {
  t.context.kakuyomu = new Kakuyomu;
});

test("new Kakuyomu", t => {
  const { kakuyomu } = t.context;
  t.ok(kakuyomu instanceof Kakuyomu);
  t.ok(_.isString(kakuyomu.name));
  t.ok(_.isString(kakuyomu.displayName));
  t.ok(_.isString(kakuyomu.baseUrl));
});

test("#publish", t => {
  const { kakuyomu } = t.context;
  const pub = factory.buildSync("publication", {
    sites: {
      kakuyomu: { novelId: "12341234" },
    },
  });
  chrome.tabs.create.callsArgWithAsync(1, { id: 123 });
  chrome.tabs.executeScript.callsArgWithAsync(2, [null]);

  return kakuyomu.publish(pub).then(() => {
    t.true(chrome.tabs.create.calledOnce);
    t.same(chrome.tabs.create.args[0][0], {
      url: `https://kakuyomu.jp/my/works/${pub.sites.kakuyomu.novelId}/episodes/new`,
    });
    t.true(chrome.tabs.executeScript.calledOnce);
    t.is(chrome.tabs.executeScript.args[0][0], 123);
    t.ok(_.isString(chrome.tabs.executeScript.args[0][1].code));

    const code = chrome.tabs.executeScript.args[0][1].code;
    const formValue = (name) => {
      const re = new RegExp(`form\\.${name}\\.value = (.+?);`);
      return JSON.parse(code.match(re)[1]);
    };

    t.is(formValue("title"), pub.title);
    t.is(formValue("body"), pub.body);
    t.is(formValue("reservation_date"), strftime("%Y-%m-%d", pub.time));
    t.is(formValue("reservation_time"), strftime("%H:%M", pub.time));
  });
});
