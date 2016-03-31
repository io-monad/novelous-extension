import { test, sinonsb, factory } from "../../common";
import Publisher from "../../../app/scripts/lib/publications/publisher";

test.beforeEach(t => {
  t.context.settings = factory.buildSync("publisherSettings");
  t.context.publisher = new Publisher(t.context.settings);
});

function stubPublish(publisher, siteName) {
  const stub = sinonsb.stub();
  publisher.sites[siteName] = { publish: stub };
  stub.returns(Promise.resolve(null));
  return stub;
}

test("new Publisher", t => {
  t.ok(t.context.publisher instanceof Publisher);
});
test("enabled sites registered", t => {
  t.true(_.isObject(t.context.publisher.sites.narou));
});
test("disabled sites not registered", t => {
  t.false(_.isObject(t.context.publisher.sites.kakuyomu));
});

test("#publishToSite calls site.publish", t => {
  const { publisher } = t.context;
  const stub = stubPublish(publisher, "narou");

  const pub = factory.buildSync("publication");
  return publisher.publishToSite(pub, "narou").then(() => {
    t.ok(stub.calledOnce);
    t.is(stub.args[0][0], pub);
  });
});

test("#publish calls site.publish", t => {
  const { publisher } = t.context;
  const stub = stubPublish(publisher, "narou");

  const pub = factory.buildSync("publication");
  return publisher.publish(pub).then(() => {
    t.ok(stub.calledOnce);
    t.is(stub.args[0][0], pub);
  });
});

test("#publishAll calls site.publish", async t => {
  const { publisher } = t.context;
  const stub = stubPublish(publisher, "narou");

  const pubs = await factory.buildMany("publication", 3);
  return publisher.publishAll(pubs).then(() => {
    t.is(stub.callCount, pubs.length);
    t.is(stub.args[0][0], pubs[0]);
    t.is(stub.args[1][0], pubs[1]);
    t.is(stub.args[2][0], pubs[2]);
  });
});
