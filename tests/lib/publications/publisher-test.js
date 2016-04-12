import { test, sinonsb, factory } from "../../common";
import Publisher from "../../../app/scripts/lib/publications/publisher";
import Sites from "../../../app/scripts/lib/sites";

test.beforeEach(t => {
  t.context.publisher = new Publisher;
});

function stubPublish(siteName) {
  const stub = sinonsb.stub(Sites[siteName], "publish");
  stub.returns(Promise.resolve());
  return stub;
}

test("new Publisher", t => {
  t.truthy(t.context.publisher instanceof Publisher);
});

test.serial("#publishToSite calls site.publish", t => {
  const { publisher } = t.context;
  const stub = stubPublish("narou");

  const pub = factory.buildSync("publication");
  return publisher.publishToSite(pub, "narou").then(() => {
    t.truthy(stub.calledOnce);
    t.is(stub.args[0][0], pub);
  });
});

test.serial("#publish calls site.publish", t => {
  const { publisher } = t.context;
  const stub = stubPublish("narou");

  const pub = factory.buildSync("publication");
  return publisher.publish(pub).then(() => {
    t.truthy(stub.calledOnce);
    t.is(stub.args[0][0], pub);
  });
});

test.serial("#publishAll calls site.publish", async t => {
  const { publisher } = t.context;
  const stub = stubPublish("narou");

  const pubs = await factory.buildMany("publication", 3);
  return publisher.publishAll(pubs).then(() => {
    t.is(stub.callCount, pubs.length);
    t.is(stub.args[0][0], pubs[0]);
    t.is(stub.args[1][0], pubs[1]);
    t.is(stub.args[2][0], pubs[2]);
  });
});
