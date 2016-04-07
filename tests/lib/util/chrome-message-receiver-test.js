import { test, sinonsb } from "../../common";
import ChromeMessageReceiver from "../../../app/scripts/lib/util/chrome-message-receiver";

class TestMessageReceiver extends ChromeMessageReceiver {
  static getMessageTypes() {
    return ["SYNC", "ASYNC", "PROMISE", "NOHANDLER"];
  }
  _getMessageHandlerMapping(t) {
    return {
      [t.SYNC]: sinonsb.spy(this.handleSync),
      [t.ASYNC]: sinonsb.spy(this.handleAsync),
      [t.PROMISE]: sinonsb.spy(this.handlePromise),
    };
  }
  constructor() {
    super("test");
  }
  handleSync(message, sender, sendResponse) {
    sendResponse("OK");
    return false;
  }
  handleAsync(message, sender, sendResponse) {
    setImmediate(() => sendResponse("OK"));
    return true;
  }
  handlePromise() {
    return Promise.resolve("OK");
  }
}

test.beforeEach(t => {
  const receiver = new TestMessageReceiver;
  const syncSpy = receiver._handlers.SYNC;
  const asyncSpy = receiver._handlers.ASYNC;
  const promiseSpy = receiver._handlers.PROMISE;
  t.context = { receiver, syncSpy, asyncSpy, promiseSpy };
});

test(".getMessageTypes", t => {
  t.deepEqual(TestMessageReceiver.getMessageTypes(),
    ["SYNC", "ASYNC", "PROMISE", "NOHANDLER"]);
});
test(".getMessageTypeMap", t => {
  t.deepEqual(TestMessageReceiver.getMessageTypeMap(),
    { SYNC: "SYNC", ASYNC: "ASYNC", PROMISE: "PROMISE", NOHANDLER: "NOHANDLER" });
});

test("#receive dispatches message to sync handler", t => {
  const { receiver, syncSpy } = t.context;
  const message = { type: "SYNC" };
  t.plan(5);
  const ret = receiver.receive(message, {}, (res) => {
    t.is(res, "OK");
  });
  t.true(syncSpy.calledOnce);
  t.is(syncSpy.args[0][0], message);
  t.is(syncSpy.thisValues[0], receiver);
  t.false(ret);
});

test.cb("#receive dispatches message to async handler", t => {
  const { receiver, asyncSpy } = t.context;
  const message = { type: "ASYNC" };
  const ret = receiver.receive(message, {}, (res) => {
    t.is(res, "OK");
    t.end();
  });
  t.true(asyncSpy.calledOnce);
  t.is(asyncSpy.args[0][0], message);
  t.is(asyncSpy.thisValues[0], receiver);
  t.true(ret);
});

test.cb("#receive dispatches message to promise handler", t => {
  const { receiver, promiseSpy } = t.context;
  const message = { type: "PROMISE" };
  const ret = receiver.receive(message, {}, (res) => {
    t.is(res, "OK");
    t.end();
  });
  t.true(promiseSpy.calledOnce);
  t.is(promiseSpy.args[0][0], message);
  t.is(promiseSpy.thisValues[0], receiver);
  t.true(ret);
});

test("#listener is bound version of #receive", t => {
  const { receiver, syncSpy } = t.context;
  const message = { type: "SYNC" };
  const ret = receiver.listener.call(null, message, {}, () => {});
  t.true(syncSpy.calledOnce);
  t.is(syncSpy.args[0][0], message);
  t.is(syncSpy.thisValues[0], receiver);
  t.false(ret);
});

test("#receive respond with error for invalid message", t => {
  const { receiver } = t.context;
  sinonsb.stub(console, "error");
  receiver.receive({ foo: "BAR" }, {}, (res) => {
    t.truthy(_.isObject(res));
    t.is(res.error, "Unknown message format");
  });
});

test("#receive respond with error for unknown message type", t => {
  const { receiver } = t.context;
  sinonsb.stub(console, "error");
  receiver.receive({ type: "WHAT" }, {}, (res) => {
    t.truthy(_.isObject(res));
    t.is(res.error, "Unknown message type");
  });
});

test("#receive does nothing for unhandled message type", t => {
  const { receiver } = t.context;
  const ret = receiver.receive({ type: "NOHANDLER" }, {}, t.fail);
  t.false(ret);
});
