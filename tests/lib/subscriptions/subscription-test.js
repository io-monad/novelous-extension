import { test, factory, sinonsb } from "../../common";
import Subscription from "../../../app/scripts/lib/subscriptions/subscription";

test.beforeEach(t => {
  t.context.settings = factory.buildSync("subscriptionSettings");
  t.context.sub = new Subscription(t.context.settings);
});

test("new Subscription", t => {
  t.ok(t.context.sub instanceof Subscription);
});

test("has properties", t => {
  const { sub, settings } = t.context;
  t.is(sub.siteName, settings.siteName);
  t.is(sub.itemType, settings.itemType);
  t.is(sub.itemId, settings.itemId);
  t.same(sub.item, settings.item);
  t.is(sub.enabled, settings.enabled);
  t.is(sub.lastUpdatedAt, settings.lastUpdatedAt);
});

test.serial.cb("setting item emits update event", t => {
  const { sub } = t.context;
  sinonsb.stub(_, "now").returns(_.now());
  sub.on("update", (given) => {
    t.is(given, sub);
    t.is(given.lastUpdatedAt, _.now());
    t.end();
  });
  sub.item = factory.buildSync("narouNovel");
});

test("setting the same item does not emit update event", t => {
  const { sub } = t.context;
  sub.on("update", t.fail);
  sub.item = _.clone(sub.item);
});
