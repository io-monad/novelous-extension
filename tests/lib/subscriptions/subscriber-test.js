import { _, test, factory, sinon, sinonsb } from "../../common";
import Subscriber from "../../../app/scripts/lib/subscriptions/subscriber";
import helpers from "./helpers";

test.beforeEach(t => {
  t.context.settings = _.times(3, () => factory.buildSync("itemsSubscriptionData"));
  t.context.subscriber = new Subscriber(t.context.settings);
});

test("new Subscriber", t => {
  t.true(t.context.subscriber instanceof Subscriber);
});

test("#subscriptionSettings getter", t => {
  const { subscriber, settings } = t.context;
  t.deepEqual(subscriber.subscriptionSettings, settings);
});

test("#subscriptionSettings setter", t => {
  const { subscriber } = t.context;
  const newSettings = _.times(5, () => factory.buildSync("itemsSubscriptionData"));
  subscriber.subscriptionSettings = newSettings;

  t.is(subscriber.subscriptions.length, newSettings.length);
  _.each(subscriber.subscriptions, (subscription, i) => {
    t.deepEqual(subscription.toObject(), newSettings[i]);
  });
});

test("#updateAll", t => {
  const { subscriber } = t.context;
  const updateStub = sinon.stub().returns(Promise.resolve());
  _.each(subscriber.subscriptions, sub => { sub.update = updateStub; });

  let emitted = false;
  subscriber.on("update", () => { emitted = true; });

  return subscriber.updateAll().then(() => {
    t.is(updateStub.callCount, subscriber.subscriptions.length);
    t.true(emitted);
  });
});

test("#updateAll skips login required subscriptions when not logged in", t => {
  const { subscriber } = t.context;

  const notLoggedIn = new Error("Not logged in");
  notLoggedIn.name = "LoginRequiredError";

  const updateStub = sinon.stub();
  updateStub.returns(Promise.reject(notLoggedIn));
  _.each(subscriber.subscriptions, sub => { sub.update = updateStub; });

  return subscriber.updateAll().then(() => {
    t.is(updateStub.callCount, 1);
  });
});

test.serial("#updateAll continues iteration when error occurred", t => {
  const { subscriber } = t.context;

  const error = new Error("Test Error");
  const updateStub = sinon.stub();
  updateStub.returns(Promise.reject(error));
  _.each(subscriber.subscriptions, sub => { sub.update = updateStub; });

  sinonsb.stub(console, "error");
  return subscriber.updateAll().then(() => {
    t.is(updateStub.callCount, subscriber.subscriptions.length);
  });
});

test.cb("#clearUnreadItems", t => {
  const { subscriber } = t.context;

  const clearStub = sinon.stub();
  _.each(subscriber.itemsSubscriptions, sub => { sub.clearUnreadItems = clearStub; });

  subscriber.on("update", () => {
    t.is(clearStub.callCount, subscriber.itemsSubscriptions.length);
    t.end();
  });
  subscriber.clearUnreadItems();
});

test("#getUnreadItemsCount", async t => {
  const { subscriber } = t.context;
  t.is(subscriber.getUnreadItemsCount(), 0);

  const subs = subscriber.itemsSubscriptions;
  subs[0].feed = helpers.getFeedWithNewItems(subs[0].feed, 2)[0];
  subs[1].feed = helpers.getFeedWithNewItems(subs[1].feed, 1)[0];

  t.is(subscriber.getUnreadItemsCount(), 3);
});
