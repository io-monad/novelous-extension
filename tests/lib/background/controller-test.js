import { test, sinonsb, factory } from "../../common";
import BackgroundController from "../../../app/scripts/lib/background/controller";
import AppData from "../../../app/scripts/lib/app/app-data";
import Subscriber from "../../../app/scripts/lib/subscriptions/subscriber";
import Publisher from "../../../app/scripts/lib/publications/publisher";
import cutil from "../../../app/scripts/lib/util/chrome-util";

test.beforeEach(t => {
  t.context.controller = new BackgroundController;
});

function startController(t, appData) {
  const { controller } = t.context;
  sinonsb.stub(cutil, "localGet").returns(Promise.resolve(appData || {}));
  return controller.start();
}

test("new BackgroundController", t => {
  const { controller } = t.context;
  t.true(controller instanceof BackgroundController);
});

test("#start returns Promise", t => {
  const { controller } = t.context;
  t.true(controller.start() instanceof Promise);
});

test.serial("#start initializes members", t => {
  return startController(t).then(controller => {
    t.true(controller.appData instanceof AppData);
    t.true(controller.subscriber instanceof Subscriber);
    t.true(controller.publisher instanceof Publisher);
  });
});

test.serial("#start updates badge counter", t => {
  return startController(t, {
    subscriptionSettings: [factory.buildSync("subscriptionSettings")],
  }).then(() => {
    t.same(chrome.browserAction.setBadgeText.lastCall.args[0], { text: "" });
  });
});

test.serial("#start sets subscriber alarm", t => {
  sinonsb.useFakeTimers();
  return startController(t, {
    lastUpdatedAt: _.now(),
    updatePeriodMinutes: 30,
  }).then(controller => {
    t.true(chrome.alarms.create.calledOnce);
    t.is(chrome.alarms.create.args[0][0], "subscriber");
    t.same(chrome.alarms.create.args[0][1], {
      when: controller.appData.nextWillUpdateAt,
      periodInMinutes: controller.appData.updatePeriodMinutes,
    });
  });
});

test.serial("#initialized returns Promise of initialization", t => {
  return startController(t).then(controller => {
    return controller.initialized().then(() => t.pass());
  });
});

test.serial("#getAppData returns Promise of AppData", t => {
  return startController(t).then(controller => {
    return controller.getAppData().then(appData => {
      t.true(appData instanceof AppData);
    });
  });
});

test.serial("#getSubscriber returns Promise of Subscriber", t => {
  return startController(t).then(controller => {
    return controller.getSubscriber().then(subscriber => {
      t.true(subscriber instanceof Subscriber);
    });
  });
});

test.serial("#getPublisher returns Promise of Publisher", t => {
  return startController(t).then(controller => {
    return controller.getPublisher().then(publisher => {
      t.true(publisher instanceof Publisher);
    });
  });
});

test.serial("#markBadgeAsSeen calls subscriber.clearNewItems", t => {
  return startController(t).then(controller => {
    const stubClear = sinonsb.stub(controller.subscriber, "clearNewItems");

    const stubSave = sinonsb.stub(controller.appData, "save");
    stubSave.returns(Promise.resolve());

    return controller.markBadgeAsSeen().then(() => {
      t.true(stubClear.calledOnce);
      t.true(stubSave.calledOnce);
      t.same(stubSave.args[0][0], ["subscriptions"]);
    });
  });
});

test.serial("#updateSubscriptions calls subscriber.updateAll", t => {
  return startController(t).then(controller => {
    const stubUpdate = sinonsb.stub(controller.subscriber, "updateAll");
    stubUpdate.returns(Promise.resolve());

    const stubSave = sinonsb.stub(controller.appData, "save");
    stubSave.returns(Promise.resolve());

    return controller.updateSubscriptions().then(() => {
      t.true(stubUpdate.calledOnce);
      t.true(stubSave.calledOnce);
      t.same(stubSave.args[0][0], ["lastUpdatedAt", "subscriptions"]);
    });
  });
});

test.serial("#publishNovel calls publisher.publishAll", t => {
  return startController(t).then(controller => {
    const stub = sinonsb.stub(controller.publisher, "publishAll");
    stub.returns(Promise.resolve());
    return controller.publishNovel([]).then(() => {
      t.true(stub.calledOnce);
    });
  });
});
