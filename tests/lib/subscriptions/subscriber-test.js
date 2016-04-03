import { test, factory, sinonsb } from "../../common";
import SiteFactory from "../../../app/scripts/lib/sites/site-factory";
import Subscriber from "../../../app/scripts/lib/subscriptions/subscriber";

test.beforeEach(t => {
  const sites = SiteFactory.createMap({ narou: true, kakuyomu: true });
  t.context.subscriber = new Subscriber(sites, [], { fetchInterval: 0 });
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
  const narouStub = stubGetItem(subscriber, "narou");
  const kakuyomuStub = stubGetItem(subscriber, "kakuyomu");

  const narouSubs = await factory.buildMany("subscription", 3);
  const kakuyomuSubs = await factory.buildMany("kakuyomuSubscription", 3);
  const subs = _.flatten(_.zip(narouSubs, kakuyomuSubs));
  _.each(subs, sub => subscriber.subscribe(sub));

  return subscriber.updateAll().then(() => {
    t.is(narouStub.callCount, narouSubs.length);
    for (let i = 0; i < narouSubs.length; i++) {
      t.is(narouStub.args[i][0], narouSubs[i].itemType);
      t.is(narouStub.args[i][1], narouSubs[i].itemId);
    }
    t.is(kakuyomuStub.callCount, kakuyomuSubs.length);
    for (let i = 0; i < kakuyomuSubs.length; i++) {
      t.is(kakuyomuStub.args[i][0], kakuyomuSubs[i].itemType);
      t.is(kakuyomuStub.args[i][1], kakuyomuSubs[i].itemId);
    }
  });
});

function stubGetItem(subscriber, siteName) {
  const stub = sinonsb.stub();
  subscriber.sites[siteName] = { getItem: stub };
  stub.returns(Promise.resolve(factory.buildSync(`${siteName}Novel`)));
  return stub;
}
