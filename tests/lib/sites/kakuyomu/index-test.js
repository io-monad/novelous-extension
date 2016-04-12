import { _, test, sinonsb, factory } from "../../../common";
import Kakuyomu from "../../../../app/scripts/lib/sites/kakuyomu";
import SiteClient from "../../../../app/scripts/lib/sites/site-client";
import KakuyomuNovelFetcher from "../../../../app/scripts/lib/sites/kakuyomu/novel-fetcher";

test("new Kakuyomu", t => {
  const kakuyomu = new Kakuyomu;
  t.true(kakuyomu instanceof Kakuyomu);
  t.is(kakuyomu.name, "kakuyomu");
  t.true(_.isString(kakuyomu.url));
  t.true(_.isString(kakuyomu.baseUrl));
  t.true(kakuyomu.client instanceof SiteClient);
});

test("#getFetcher", t => {
  const kakuyomu = new Kakuyomu;
  const fetcher = kakuyomu.getFetcher(Kakuyomu.FetcherTypes.NOVEL);
  t.true(fetcher instanceof KakuyomuNovelFetcher);
});

test("#publish", t => {
  const kakuyomu = new Kakuyomu;
  const pub = factory.buildSync("publication", { sites: { kakuyomu: "123" } });
  const stub = sinonsb.stub(kakuyomu.formOpener, "openForm");
  stub.returns(Promise.resolve());

  return kakuyomu.publish(pub).then(() => {
    t.truthy(stub.calledOnce);
    t.is(stub.args[0][0], pub);
  });
});
