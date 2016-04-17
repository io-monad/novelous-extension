import { _, assert, sinonsb, factory } from "../../common";
import BackgroundController from "../../../app/scripts/lib/background/controller";
import AppData from "../../../app/scripts/lib/app/app-data";
import Subscriber from "../../../app/scripts/lib/subscriptions/subscriber";
import Publisher from "../../../app/scripts/lib/publications/publisher";
import UpdateTimer from "../../../app/scripts/lib/background/update-timer";
import cutil from "../../../app/scripts/lib/util/chrome-util";
import isPromiseLike from "../../../app/scripts/lib/util/is-promise-like";

describe("BackgroundController", () => {
  let controller;

  beforeEach(() => {
    controller = new BackgroundController;
  });

  function startController(appData) {
    sinonsb.stub(cutil, "localGet").returns(Promise.resolve(appData || {}));
    return controller.start();
  }

  it("new BackgroundController", () => {
    assert(controller instanceof BackgroundController);
  });

  describe("#start", () => {
    it("returns Promise", () => {
      assert(isPromiseLike(controller.start()));
    });

    it("initializes members", () => {
      return startController().then(() => {
        assert(controller.appData instanceof AppData);
        assert(controller.subscriber instanceof Subscriber);
        assert(controller.publisher instanceof Publisher);
        assert(controller.updateTimer instanceof UpdateTimer);
      });
    });

    it("updates badge counter", () => {
      const subData = factory.buildSync("itemsSubscriptionData");
      const newFeedItem = factory.buildSync("feedItem");
      subData.feedData.items.push(newFeedItem);

      return startController({
        subscriptionSettings: [subData],
      }).then(() => {
        assert.deepEqual(chrome.browserAction.setBadgeText.lastCall.args[0], { text: "1" });
      });
    });

    it("starts update timer", () => {
      sinonsb.useFakeTimers();
      return startController({
        lastUpdatedAt: _.now(),
        updatePeriodMinutes: 30,
      }).then(() => {
        assert(chrome.alarms.create.calledOnce);
        assert(chrome.alarms.create.args[0][0] === "update");
        assert.deepEqual(chrome.alarms.create.args[0][1], {
          when: controller.updateTimer.nextWillUpdateAt,
          periodInMinutes: controller.updateTimer.updatePeriodMinutes,
        });
      });
    });
  });

  describe("#initialized", () => {
    it("returns Promise of initialization", (done) => {
      return startController().then(() => {
        return controller.initialized().then(() => { done(); });
      });
    });
  });

  describe("#getAppData", () => {
    it("returns Promise of AppData", () => {
      return startController().then(() => {
        return controller.getAppData().then(appData => {
          assert(appData instanceof AppData);
        });
      });
    });
  });

  describe("#getSubscriber", () => {
    it("returns Promise of Subscriber", () => {
      return startController().then(() => {
        return controller.getSubscriber().then(subscriber => {
          assert(subscriber instanceof Subscriber);
        });
      });
    });
  });

  describe("#getPublisher", () => {
    it("returns Promise of Publisher", () => {
      return startController().then(() => {
        return controller.getPublisher().then(publisher => {
          assert(publisher instanceof Publisher);
        });
      });
    });
  });

  describe("#markBadgeAsSeen", () => {
    it("calls subscriber.clearUnreadItems", () => {
      return startController().then(() => {
        const stubClear = sinonsb.stub(controller.subscriber, "clearUnreadItems");
        return controller.markBadgeAsSeen().then(() => {
          assert(stubClear.calledOnce);
        });
      });
    });
  });

  describe("#updateSubscriptions", () => {
    it("calls subscriber.updateAll", () => {
      return startController().then(() => {
        const stubUpdate = sinonsb.stub(controller.subscriber, "updateAll");
        stubUpdate.returns(Promise.resolve());
        return controller.updateSubscriptions().then(() => {
          assert(stubUpdate.calledOnce);
        });
      });
    });
  });

  describe("#publishNovel", () => {
    it("calls publisher.publishAll", () => {
      return startController().then(() => {
        const stub = sinonsb.stub(controller.publisher, "publishAll");
        stub.returns(Promise.resolve());
        return controller.publishNovel([]).then(() => {
          assert(stub.calledOnce);
        });
      });
    });
  });
});
