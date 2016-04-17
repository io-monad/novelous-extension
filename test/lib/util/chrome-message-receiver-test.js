import { _, assert, sinonsb } from "../../common";
import ChromeMessageReceiver from "../../../app/scripts/lib/util/chrome-message-receiver";

describe("ChromeMessageReceiver", () => {
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

  let receiver;
  let syncSpy;
  let asyncSpy;
  let promiseSpy;

  beforeEach(() => {
    receiver = new TestMessageReceiver;
    syncSpy = receiver._handlers.SYNC;
    asyncSpy = receiver._handlers.ASYNC;
    promiseSpy = receiver._handlers.PROMISE;
  });

  it(".getMessageTypes", () => {
    assert.deepEqual(TestMessageReceiver.getMessageTypes(),
      ["SYNC", "ASYNC", "PROMISE", "NOHANDLER"]);
  });
  it(".getMessageTypeMap", () => {
    assert.deepEqual(TestMessageReceiver.getMessageTypeMap(),
      { SYNC: "SYNC", ASYNC: "ASYNC", PROMISE: "PROMISE", NOHANDLER: "NOHANDLER" });
  });

  describe("#receive", () => {
    it("dispatches message to sync handler", () => {
      const message = { type: "SYNC" };
      const ret = receiver.receive(message, {}, (res) => {
        assert(res === "OK");
      });
      assert(syncSpy.calledOnce);
      assert(syncSpy.args[0][0] === message);
      assert(syncSpy.thisValues[0] === receiver);
      assert(!ret);
    });

    it("dispatches message to async handler", (done) => {
      const message = { type: "ASYNC" };
      const ret = receiver.receive(message, {}, (res) => {
        assert(res === "OK");
        done();
      });
      assert(asyncSpy.calledOnce);
      assert(asyncSpy.args[0][0] === message);
      assert(asyncSpy.thisValues[0] === receiver);
      assert(ret);
    });

    it("dispatches message to promise handler", (done) => {
      const message = { type: "PROMISE" };
      const ret = receiver.receive(message, {}, (res) => {
        assert(res === "OK");
        done();
      });
      assert(promiseSpy.calledOnce);
      assert(promiseSpy.args[0][0] === message);
      assert(promiseSpy.thisValues[0] === receiver);
      assert(ret);
    });
  });

  describe("#listener", () => {
    it("is bound version of #receive", () => {
      const message = { type: "SYNC" };
      const ret = receiver.listener.call(null, message, {}, () => {});
      assert(syncSpy.calledOnce);
      assert(syncSpy.args[0][0] === message);
      assert(syncSpy.thisValues[0] === receiver);
      assert(!ret);
    });
  });

  describe("#receive", () => {
    it("respond with error for invalid message", () => {
      sinonsb.stub(console, "error");
      receiver.receive({ foo: "BAR" }, {}, (res) => {
        assert(_.isObject(res));
        assert(res.error === "Unknown message format");
      });
    });

    it("respond with error for unknown message type", () => {
      sinonsb.stub(console, "error");
      receiver.receive({ type: "WHAT" }, {}, (res) => {
        assert(_.isObject(res));
        assert(res.error === "Unknown message type");
      });
    });

    it("does nothing for unhandled message type", () => {
      const ret = receiver.receive({ type: "NOHANDLER" }, {}, () => assert(false));
      assert(!ret);
    });
  });
});
