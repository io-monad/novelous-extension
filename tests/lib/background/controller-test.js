import { test, sinonsb, factory } from "../../common";
import BackgroundController from "../../../app/scripts/lib/background/controller";
import AppData from "../../../app/scripts/lib/app/app-data";
import Subscriber from "../../../app/scripts/lib/subscriptions/subscriber";
import Publisher from "../../../app/scripts/lib/publications/publisher";
import UpdateTimer from "../../../app/scripts/lib/background/update-timer";
import cutil from "../../../app/scripts/lib/util/chrome-util";
import isPromiseLike from "../../../app/scripts/lib/util/is-promise-like";

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
  t.true(isPromiseLike(controller.start()));
});

test.serial("#start initializes members", t => {
  return startController(t).then(controller => {
    t.true(controller.appData instanceof AppData);
    t.true(controller.subscriber instanceof Subscriber);
    t.true(controller.publisher instanceof Publisher);
    t.true(controller.updateTimer instanceof UpdateTimer);
  });
});

test.serial("#start updates badge counter", t => {
  const settings = factory.buildSync("subscriptionSettings");
  const newFeedItem = factory.buildSync("feedItem");
  settings.feedData.items.push(newFeedItem);

  return startController(t, {
    subscriptionSettings: [settings],
  }).then(() => {
    t.deepEqual(chrome.browserAction.setBadgeText.lastCall.args[0], { text: "1" });
  });
});

test.serial("#start starts update timer", t => {
  sinonsb.useFakeTimers();
  return startController(t, {
    lastUpdatedAt: _.now(),
    updatePeriodMinutes: 30,
  }).then(controller => {
    t.true(chrome.alarms.create.calledOnce);
    t.is(chrome.alarms.create.args[0][0], "update");
    t.deepEqual(chrome.alarms.create.args[0][1], {
      when: controller.updateTimer.nextWillUpdateAt,
      periodInMinutes: controller.updateTimer.updatePeriodMinutes,
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
    return controller.markBadgeAsSeen().then(() => {
      t.true(stubClear.calledOnce);
    });
  });
});

test.serial("#updateSubscriptions calls subscriber.updateAll", t => {
  return startController(t).then(controller => {
    const stubUpdate = sinonsb.stub(controller.subscriber, "updateAll");
    stubUpdate.returns(Promise.resolve());
    return controller.updateSubscriptions().then(() => {
      t.true(stubUpdate.calledOnce);
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
