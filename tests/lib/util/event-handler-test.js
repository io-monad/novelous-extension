import { _, test, sinon } from "../../common";
import eventHandler from "../../../app/scripts/lib/util/event-handler";

let testEvents;

test.before(() => {
  testEvents = eventHandler([
    "HELLO",
    "PING",
  ]);
});

test("returns export object", t => {
  t.truthy(_.isObject(testEvents));
  t.truthy(_.isFunction(testEvents.buildHandler));
  t.is(testEvents.HELLO, "HELLO");
  t.is(testEvents.PING, "PING");
});

test("#buildHandler builds handler function", t => {
  const hello = [sinon.spy(), sinon.spy()];
  [
    e => ({ [e.HELLO]: hello[0] }),
    { [testEvents.HELLO]: hello[1] },
  ].forEach((builder, i) => {
    const handler = testEvents.buildHandler(builder);
    t.truthy(_.isFunction(handler));

    const message = { type: "HELLO", foo: "bar" };
    handler(message);
    t.truthy(hello[i].calledOnce);
    t.is(hello[i].firstCall.args[0], message);
  });
});

test("#buildHandler throws Error for unknown event type", t => {
  t.throws(() => {
    testEvents.buildHandler(() => ({
      UNKNOWN: () => {},
    }));
  });
  t.throws(() => {
    testEvents.buildHandler({
      UNKNOWN: () => {},
    });
  });
});

test("Built handler returns a value returned by callback", t => {
  const handler = testEvents.buildHandler({
    [testEvents.HELLO](msg) {
      return msg.foo;
    },
  });

  const message = { type: "HELLO", foo: "bar" };
  const ret = handler(message);
  t.is(ret, "bar");
});

test.cb("Built handler handles returned Promise", t => {
  const handler = testEvents.buildHandler({
    [testEvents.HELLO](msg) {
      return Promise.resolve({ test: msg.foo });
    },
  });

  const message = { type: "HELLO", foo: "bar" };
  const ret = handler(message, {}, (result) => {
    t.deepEqual(result, { test: "bar" });
    t.end();
  });
  t.true(ret);
});

test.cb("Built handler handles error callback", t => {
  const handler = testEvents.buildHandler({
    [testEvents.HELLO](msg) {
      return Promise.reject(msg.foo);
    },
  });

  const message = { type: "HELLO", foo: "bar" };
  const ret = handler(message, {}, (result) => {
    t.deepEqual(result, { error: "bar" });
    t.end();
  });
  t.true(ret);
});
