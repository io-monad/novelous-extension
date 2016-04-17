import { _, assert, sinonsb } from "../../common";
import UpdateTimer from "../../../app/scripts/lib/background/update-timer";

describe("UpdateTimer", () => {
  let updatePeriodMinutes;
  let lastUpdatedAt;
  let updateTimer;
  let start;
  let stop;

  beforeEach(() => {
    updatePeriodMinutes = 30;
    lastUpdatedAt = 1234567890;
    updateTimer = new UpdateTimer(
      updatePeriodMinutes,
      lastUpdatedAt
    );

    start = sinonsb.stub(updateTimer.alarm, "start");
    stop = sinonsb.stub(updateTimer.alarm, "stop");
  });

  it("has properties set", () => {
    assert(updateTimer.updatePeriodMinutes === updatePeriodMinutes);
    assert(updateTimer.lastUpdatedAt === lastUpdatedAt);
    assert(updateTimer.nextWillUpdateAt === lastUpdatedAt + updatePeriodMinutes * 60 * 1000);
    assert(!updateTimer.started);
  });

  describe("#start", () => {
    it("sets alarm", () => {
      updateTimer.start();
      assert(updateTimer.started);
      assert(start.calledOnce);
      assert.deepEqual(start.args[0][0], {
        when: updateTimer.nextWillUpdateAt,
        periodInMinutes: updateTimer.updatePeriodMinutes,
      });
    });

    it("does nothing when already started", () => {
      updateTimer.start();
      updateTimer.start();
      assert(start.calledOnce);
    });

    it("returns self", () => {
      assert(updateTimer.start() === updateTimer);
    });
  });

  describe("#stop", () => {
    it("stops alarm", () => {
      updateTimer.start();
      updateTimer.stop();
      assert(!updateTimer.started);
      assert(stop.calledOnce);
    });

    it("does nothing when not started", () => {
      updateTimer.stop();
      assert(!stop.called);
    });

    it("returns self", () => {
      assert(updateTimer.stop() === updateTimer);
    });
  });

  describe("#reset", () => {
    it("updates lastUpdatedAt", () => {
      sinonsb.stub(_, "now").returns(1234599999);

      updateTimer.reset();
      assert(updateTimer.lastUpdatedAt === 1234599999);
      assert(updateTimer.nextWillUpdateAt === 1234599999 + updatePeriodMinutes * 60 * 1000);
    });

    it("returns self", () => {
      assert(updateTimer.reset() === updateTimer);
    });
  });

  describe("#updatePeriodMinutes", () => {
    it("setter sets alarm", (done) => {
      updateTimer.on("update", () => {
        assert(updateTimer.updatePeriodMinutes === 60);
        assert(updateTimer.nextWillUpdateAt === lastUpdatedAt + 60 * 60 * 1000);
        done();
      });
      updateTimer.updatePeriodMinutes = 60;
    });

    it("setter uses default for null", () => {
      updateTimer.updatePeriodMinutes = null;
      assert(updateTimer.updatePeriodMinutes === 30);
    });

    it("setter updates alarm", () => {
      updateTimer.start();
      updateTimer.updatePeriodMinutes = 60;

      assert(updateTimer.updatePeriodMinutes === 60);
      assert(start.calledTwice);
      assert.deepEqual(start.args[1][0], {
        when: updateTimer.nextWillUpdateAt,
        periodInMinutes: updateTimer.updatePeriodMinutes,
      });
    });
  });

  describe("#lastUpdatedAt", () => {
    it("setter sets alarm", (done) => {
      updateTimer.on("update", () => {
        assert(updateTimer.lastUpdatedAt === 1234599999);
        assert(updateTimer.nextWillUpdateAt === 1234599999 + updatePeriodMinutes * 60 * 1000);
        done();
      });
      updateTimer.lastUpdatedAt = 1234599999;
    });

    it("setter updates alarm", () => {
      updateTimer.start();
      updateTimer.lastUpdatedAt = 1234599999;

      assert(updateTimer.lastUpdatedAt === 1234599999);
      assert(start.calledTwice);
      assert.deepEqual(start.args[1][0], {
        when: updateTimer.nextWillUpdateAt,
        periodInMinutes: updateTimer.updatePeriodMinutes,
      });
    });
  });

  it("emits timer event when alarm is ringing", (done) => {
    sinonsb.stub(_, "now").returns(1234599999);

    updateTimer.start();

    updateTimer.on("timer", () => {
      assert(updateTimer.lastUpdatedAt === 1234599999);
      done();
    });
    updateTimer.alarm.emit("alarm");
  });
});
