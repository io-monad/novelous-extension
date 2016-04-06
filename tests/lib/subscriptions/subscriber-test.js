import { test, factory, sinon } from "../../common";
import Subscriber from "../../../app/scripts/lib/subscriptions/subscriber";

test.beforeEach(t => {
  t.context.subscriber = new Subscriber([], { fetchInterval: 0 });
});

test("new Subscriber", t => {
  t.ok(t.context.subscriber instanceof Subscriber);
});

test.cb("#subscribe", t => {
  const { subscriber } = t.context;
  const subscription = factory.buildSync("subscription");
  subscriber.on("update", t.end);
  subscriber.subscribe(subscription);
  t.is(subscriber.subscriptions.length, 1);
  t.is(subscriber.subscriptions[0], subscription);
});

test.cb("#unsubscribe", t => {
  const { subscriber } = t.context;
  const subscription = factory.buildSync("subscription");
  subscriber.subscribe(subscription);
  subscriber.on("update", t.end);
  subscriber.unsubscribe(subscription);
  t.same(subscriber.subscriptions, []);
});

test("#updateAll", async t => {
  const { subscriber } = t.context;
  const subs = await factory.buildMany("subscription", 3);
  const updateStub = sinon.stub().returns(Promise.resolve(true));
  _.each(subs, sub => { sub.update = updateStub; });
  subscriber.subscriptions = subs;

  return subscriber.updateAll().then(() => {
    t.is(updateStub.callCount, subs.length);
  });
});

test.cb("#clearNewItems", t => {
  const { subscriber } = t.context;
  const N = 3;
  subscriber.subscriptions = _.range(N).map(() => factory.buildSync("subscription"));

  const clearStub = sinon.stub();
  _.each(subscriber.subscriptions, sub => { sub.clearNewItems = clearStub; });

  subscriber.on("clear", () => {
    t.is(clearStub.callCount, N);
    t.end();
  });
  subscriber.clearNewItems();
});
