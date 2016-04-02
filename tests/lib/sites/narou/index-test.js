import { test, sinonsb, factory } from "../../../common";
import Narou from "../../../../app/scripts/lib/sites/narou";

test("new Narou", t => {
  const narou = new Narou;
  t.ok(narou instanceof Narou);
  t.is(narou.name, "narou");
  t.ok(_.isString(narou.displayName));
  t.ok(_.isString(narou.baseUrl));
});

test("#getItem with MY_NOVELS item type", async t => {
  const narou = new Narou;
  const items = [];
  const stub = sinonsb.stub(narou.myNovelLister, "listNovels");
  stub.returns(Promise.resolve(items));

  return narou.getItem(Narou.ItemType.MY_NOVELS, null).then((given) => {
    t.ok(stub.calledOnce);
    t.is(given, items);
  });
});

test("#getItem with MY_MESSAGES item type", async t => {
  const narou = new Narou;
  const items = [];
  const stub = sinonsb.stub(narou.myMessageLister, "listReceivedMessages");
  stub.returns(Promise.resolve(items));

  return narou.getItem(Narou.ItemType.MY_MESSAGES, null).then((given) => {
    t.ok(stub.calledOnce);
    t.is(given, items);
  });
});

test("#getItem with MY_COMMENTS item type", async t => {
  const narou = new Narou;
  const items = [];
  const stub = sinonsb.stub(narou.myCommentLister, "listReceivedComments");
  stub.returns(Promise.resolve(items));

  return narou.getItem(Narou.ItemType.MY_COMMENTS, null).then((given) => {
    t.ok(stub.calledOnce);
    t.is(given, items);
  });
});

test("#getItem with MY_REVIEWS item type", async t => {
  const narou = new Narou;
  const items = [];
  const stub = sinonsb.stub(narou.myReviewLister, "listReceivedReviews");
  stub.returns(Promise.resolve(items));

  return narou.getItem(Narou.ItemType.MY_REVIEWS, null).then((given) => {
    t.ok(stub.calledOnce);
    t.is(given, items);
  });
});

test("#getItem with NOVEL item type", t => {
  const narou = new Narou;
  const item = factory.buildSync("narouNovel");
  const stub = sinonsb.stub(narou.novelFetcher, "fetchNovel");
  stub.returns(Promise.resolve(item));

  return narou.getItem(Narou.ItemType.NOVEL, "TEST").then((given) => {
    t.ok(stub.calledOnce);
    t.is(stub.args[0][0], "TEST");
    t.is(given, item);
  });
});

test("#publish", t => {
  const narou = new Narou;
  const pub = factory.buildSync("publication");
  const stub = sinonsb.stub(narou.formOpener, "openForm");
  stub.returns(Promise.resolve());

  return narou.publish(pub).then(() => {
    t.ok(stub.calledOnce);
    t.is(stub.args[0][0], pub);
  });
});
