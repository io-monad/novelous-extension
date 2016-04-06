import { test, factory, sinonsb } from "../../common";
import Subscription from "../../../app/scripts/lib/subscriptions/subscription";
import Feed from "../../../app/scripts/lib/feeds/feed";

test.beforeEach(t => {
  t.context.settings = factory.buildSync("subscriptionSettings");
  t.context.sub = new Subscription(t.context.settings);
});

test("new Subscription", t => {
  t.ok(t.context.sub instanceof Subscription);
});

test("has properties", t => {
  const { sub, settings } = t.context;
  t.is(sub.feedName, settings.feedName);
  t.is(sub.enabled, settings.enabled);
  t.is(sub.lastUpdatedAt, settings.lastUpdatedAt);
  t.ok(sub.feed instanceof Feed);
});

test("#update calls feed.update and emits update event if updated", t => {
  const { sub } = t.context;
  const stub = sinonsb.stub(sub.feed, "update").returns(Promise.resolve(true));
  sinonsb.stub(_, "now").returns(1234567890);
  t.plan(3);

  sub.on("update", (given) => {
    t.is(given, sub);
  });
  return sub.update().then(() => {
    t.true(stub.calledOnce);
    t.is(sub.settings.lastUpdatedAt, _.now());
  });
});

test("#update does not emit update event unless updated", t => {
  const { sub } = t.context;
  sinonsb.stub(sub.feed, "update").returns(Promise.resolve(false));
  sub.on("update", t.fail);
  return sub.update();
});

test.cb("#clearNewItems calls feed.clearNewItems and emits clear event", t => {
  const { sub } = t.context;
  const stub = sinonsb.stub(sub.feed, "clearNewItems");

  sub.on("clear", (given) => {
    t.is(given, sub);
    t.true(stub.calledOnce);
    t.end();
  });
  sub.clearNewItems();
});
