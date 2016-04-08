import { test, sinonsb } from "../../common";
import UpdateTimer from "../../../app/scripts/lib/background/update-timer";

test.beforeEach(t => {
  t.context.updatePeriodMinutes = 30;
  t.context.lastUpdatedAt = 1234567890;
  t.context.updateTimer = new UpdateTimer(
    t.context.updatePeriodMinutes,
    t.context.lastUpdatedAt
  );

  t.context.start = sinonsb.stub(t.context.updateTimer.alarm, "start");
  t.context.stop = sinonsb.stub(t.context.updateTimer.alarm, "stop");
});

test("has properties set", t => {
  const { updateTimer, updatePeriodMinutes, lastUpdatedAt } = t.context;
  t.is(updateTimer.updatePeriodMinutes, updatePeriodMinutes);
  t.is(updateTimer.lastUpdatedAt, lastUpdatedAt);
  t.is(updateTimer.nextWillUpdateAt, lastUpdatedAt + updatePeriodMinutes * 60 * 1000);
  t.false(updateTimer.started);
});

test("#start sets alarm", t => {
  const { updateTimer, start } = t.context;
  updateTimer.start();
  t.true(updateTimer.started);
  t.true(start.calledOnce);
  t.deepEqual(start.args[0][0], {
    when: updateTimer.nextWillUpdateAt,
    periodInMinutes: updateTimer.updatePeriodMinutes,
  });
});

test("#start does nothing when already started", t => {
  const { updateTimer, start } = t.context;
  updateTimer.start();
  updateTimer.start();
  t.true(start.calledOnce);
});

test("#start returns self", t => {
  const { updateTimer } = t.context;
  t.is(updateTimer.start(), updateTimer);
});

test("#stop stops alarm", t => {
  const { updateTimer, stop } = t.context;
  updateTimer.start();
  updateTimer.stop();
  t.false(updateTimer.started);
  t.true(stop.calledOnce);
});

test("#stop does nothing when not started", t => {
  const { updateTimer, stop } = t.context;

  updateTimer.stop();
  t.false(stop.called);
});

test("#stop returns self", t => {
  const { updateTimer } = t.context;
  t.is(updateTimer.stop(), updateTimer);
});

test.serial("#reset updates lastUpdatedAt", t => {
  const { updateTimer, updatePeriodMinutes } = t.context;
  sinonsb.stub(_, "now").returns(1234599999);

  updateTimer.reset();
  t.is(updateTimer.lastUpdatedAt, 1234599999);
  t.is(updateTimer.nextWillUpdateAt, 1234599999 + updatePeriodMinutes * 60 * 1000);
});

test("#reset returns self", t => {
  const { updateTimer } = t.context;
  t.is(updateTimer.reset(), updateTimer);
});

test.cb("#updatePeriodMinutes setter sets alarm", t => {
  const { updateTimer, lastUpdatedAt } = t.context;
  updateTimer.on("update", () => {
    t.is(updateTimer.updatePeriodMinutes, 60);
    t.is(updateTimer.nextWillUpdateAt, lastUpdatedAt + 60 * 60 * 1000);
    t.end();
  });
  updateTimer.updatePeriodMinutes = 60;
});

test("#updatePeriodMinutes setter uses default for null", t => {
  const { updateTimer } = t.context;
  updateTimer.updatePeriodMinutes = null;
  t.is(updateTimer.updatePeriodMinutes, 30);
});

test("#updatePeriodMinutes setter updates alarm", t => {
  const { updateTimer, start } = t.context;

  updateTimer.start();
  updateTimer.updatePeriodMinutes = 60;

  t.is(updateTimer.updatePeriodMinutes, 60);
  t.true(start.calledTwice);
  t.deepEqual(start.args[1][0], {
    when: updateTimer.nextWillUpdateAt,
    periodInMinutes: updateTimer.updatePeriodMinutes,
  });
});

test.cb("#lastUpdatedAt setter sets alarm", t => {
  const { updateTimer, updatePeriodMinutes } = t.context;
  updateTimer.on("update", () => {
    t.is(updateTimer.lastUpdatedAt, 1234599999);
    t.is(updateTimer.nextWillUpdateAt, 1234599999 + updatePeriodMinutes * 60 * 1000);
    t.end();
  });
  updateTimer.lastUpdatedAt = 1234599999;
});

test("#lastUpdatedAt setter updates alarm", t => {
  const { updateTimer, start } = t.context;

  updateTimer.start();
  updateTimer.lastUpdatedAt = 1234599999;

  t.is(updateTimer.lastUpdatedAt, 1234599999);
  t.true(start.calledTwice);
  t.deepEqual(start.args[1][0], {
    when: updateTimer.nextWillUpdateAt,
    periodInMinutes: updateTimer.updatePeriodMinutes,
  });
});

test.serial.cb("emits timer event when alarm is ringing", t => {
  const { updateTimer } = t.context;
  sinonsb.stub(_, "now").returns(1234599999);

  updateTimer.start();

  updateTimer.on("timer", () => {
    t.is(updateTimer.lastUpdatedAt, 1234599999);
    t.end();
  });
  updateTimer.alarm.emit("alarm");
});
