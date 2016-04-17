import { assert, sinonsb, factory } from "../../common";
import Publisher from "../../../app/scripts/lib/publications/publisher";
import Sites from "../../../app/scripts/lib/sites";

describe("Publisher", () => {
  let publisher;

  beforeEach(() => {
    publisher = new Publisher;
  });

  function stubPublish(siteName) {
    const stub = sinonsb.stub(Sites[siteName], "publish");
    stub.returns(Promise.resolve());
    return stub;
  }

  it("new Publisher", () => {
    assert(publisher instanceof Publisher);
  });

  describe("#publishToSite", () => {
    it("calls site.publish", () => {
      const stub = stubPublish("narou");

      const pub = factory.buildSync("publication");
      return publisher.publishToSite(pub, "narou").then(() => {
        assert(stub.calledOnce);
        assert(stub.args[0][0] === pub);
      });
    });
  });

  describe("#publish", () => {
    it("calls site.publish", () => {
      const stub = stubPublish("narou");

      const pub = factory.buildSync("publication");
      return publisher.publish(pub).then(() => {
        assert(stub.calledOnce);
        assert(stub.args[0][0] === pub);
      });
    });
  });

  describe("#publishAll", () => {
    it("calls site.publish", async () => {
      const stub = stubPublish("narou");

      const pubs = await factory.buildMany("publication", 3);
      return publisher.publishAll(pubs).then(() => {
        assert(stub.callCount === pubs.length);
        assert(stub.args[0][0] === pubs[0]);
        assert(stub.args[1][0] === pubs[1]);
        assert(stub.args[2][0] === pubs[2]);
      });
    });
  });
});
