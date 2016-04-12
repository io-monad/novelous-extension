import { _, test, sinonsb, factory } from "../../../common";
import Narou from "../../../../app/scripts/lib/sites/narou";
import SiteClient from "../../../../app/scripts/lib/sites/site-client";
import NarouNovelFetcher from "../../../../app/scripts/lib/sites/narou/novel-fetcher";

test("new Narou", t => {
  const narou = new Narou;
  t.truthy(narou instanceof Narou);
  t.is(narou.name, "narou");
  t.true(_.isString(narou.url));
  t.true(_.isString(narou.baseUrl));
  t.true(narou.client instanceof SiteClient);
});

test("#getFetcher", t => {
  const narou = new Narou;
  const fetcher = narou.getFetcher(Narou.FetcherTypes.NOVEL);
  t.true(fetcher instanceof NarouNovelFetcher);
});

test("#publish", t => {
  const narou = new Narou;
  const pub = factory.buildSync("publication");
  const stub = sinonsb.stub(narou.formOpener, "openForm");
  stub.returns(Promise.resolve());

  return narou.publish(pub).then(() => {
    t.truthy(stub.calledOnce);
    t.is(stub.args[0][0], pub);
  });
});
