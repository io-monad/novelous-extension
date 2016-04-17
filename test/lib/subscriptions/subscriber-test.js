import { _, assert, factory, sinon, sinonsb } from "../../common";
import Subscriber from "../../../app/scripts/lib/subscriptions/subscriber";
import helpers from "./helpers";

describe("Subscriber", () => {
  let settings;
  let subscriber;

  beforeEach(() => {
    settings = _.times(3, () => factory.buildSync("itemsSubscriptionData"));
    subscriber = new Subscriber(settings);
  });

  it("new Subscriber", () => {
    assert(subscriber instanceof Subscriber);
  });

  describe("#subscriptionSettings", () => {
    it("getter", () => {
      assert.deepEqual(subscriber.subscriptionSettings, settings);
    });

    it("setter", () => {
      const newSettings = _.times(5, () => factory.buildSync("itemsSubscriptionData"));
      subscriber.subscriptionSettings = newSettings;

      assert(subscriber.subscriptions.length === newSettings.length);
      _.each(subscriber.subscriptions, (subscription, i) => {
        assert.deepEqual(subscription.toObject(), newSettings[i]);
      });
    });
  });

  describe("#updateAll", () => {
    it("updates all subscriptions", () => {
      const updateStub = sinon.stub().returns(Promise.resolve());
      _.each(subscriber.subscriptions, sub => { sub.update = updateStub; });

      let emitted = false;
      subscriber.on("update", () => { emitted = true; });

      return subscriber.updateAll().then(() => {
        assert(updateStub.callCount === subscriber.subscriptions.length);
        assert(emitted);
      });
    });

    it("skips login required subscriptions when not logged in", () => {
      const notLoggedIn = new Error("Not logged in");
      notLoggedIn.name = "LoginRequiredError";

      const updateStub = sinon.stub();
      updateStub.returns(Promise.reject(notLoggedIn));
      _.each(subscriber.subscriptions, sub => { sub.update = updateStub; });

      return subscriber.updateAll().then(() => {
        assert(updateStub.callCount === 1);
      });
    });

    it("continues iteration when error occurred", () => {
      const error = new Error("Test Error");
      const updateStub = sinon.stub();
      updateStub.returns(Promise.reject(error));
      _.each(subscriber.subscriptions, sub => { sub.update = updateStub; });

      sinonsb.stub(console, "error");
      return subscriber.updateAll().then(() => {
        assert(updateStub.callCount === subscriber.subscriptions.length);
      });
    });
  });

  describe("#clearUnreadItems", () => {
    it("clears unread items", (done) => {
      const clearStub = sinon.stub();
      _.each(subscriber.itemsSubscriptions, sub => { sub.clearUnreadItems = clearStub; });

      subscriber.on("update", () => {
        assert(clearStub.callCount === subscriber.itemsSubscriptions.length);
        done();
      });
      subscriber.clearUnreadItems();
    });
  });

  describe("#getUnreadItemsCount", () => {
    it("returns number of unread items", async () => {
      assert(subscriber.getUnreadItemsCount() === 0);

      const subs = subscriber.itemsSubscriptions;
      subs[0].feed = helpers.getFeedWithNewItems(subs[0].feed, 2)[0];
      subs[1].feed = helpers.getFeedWithNewItems(subs[1].feed, 1)[0];

      assert(subscriber.getUnreadItemsCount() === 3);
    });
  });
});
