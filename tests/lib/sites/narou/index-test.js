import { test, sinonsb, factory } from "../../../common";
import Narou from "../../../../app/scripts/lib/sites/narou";

test("new Narou", t => {
  const narou = new Narou;
  t.ok(narou instanceof Narou);
  t.is(narou.name, "narou");
  t.ok(_.isString(narou.displayName));
  t.ok(_.isString(narou.baseUrl));
});

test("#getItem with novel item type", t => {
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

test("#getItem with messages item type", t => {
  const narou = new Narou;
  const messageList = factory.buildSync("narouMessageList");
  const stub = sinonsb.stub(narou.messageLister, "listMessages");
  stub.returns(Promise.resolve(messageList));

  return narou.getItem(Narou.ItemType.MESSAGES, Narou.MessageType.RECEIVED).then((given) => {
    t.ok(stub.calledOnce);
    t.is(stub.args[0][0], Narou.MessageType.RECEIVED);
    t.is(given, messageList);
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
