import EventEmitter from "eventemitter3";
import ChromeAlarm from "../util/chrome-alarm";
import AppData from "../app/app-data";

const DEFAULT_UPDATE_PERIOD_MINUTES = AppData.defaults.updatePeriodMinutes;
const MIN_UPDATE_PERIOD_MINUTES = AppData.schema.properties.updatePeriodMinutes.minimum;

export default class UpdateTimer extends EventEmitter {
  /**
   * @param {number} updatePeriodMinutes
   * @param {number} lastUpdatedAt
   */
  constructor(updatePeriodMinutes, lastUpdatedAt) {
    super();
    this.alarm = new ChromeAlarm("update");
    this.updatePeriodMinutes = updatePeriodMinutes;
    this.lastUpdatedAt = lastUpdatedAt;
    this._started = false;
    this._bindAlarmEvents();
  }

  get updatePeriodMinutes() {
    return this._updatePeriodMinutes;
  }
  set updatePeriodMinutes(minutes) {
    minutes = minutes || DEFAULT_UPDATE_PERIOD_MINUTES;
    minutes = Math.max(minutes, MIN_UPDATE_PERIOD_MINUTES);
    if (this._updatePeriodMinutes !== minutes) {
      this._updatePeriodMinutes = minutes;
      this._setAlarm();
      this.emit("update");
    }
  }

  get lastUpdatedAt() {
    return this._lastUpdatedAt;
  }
  set lastUpdatedAt(timestamp) {
    if (this._lastUpdatedAt !== timestamp) {
      this._lastUpdatedAt = timestamp;
      this._setAlarm();
      this.emit("update");
    }
  }

  get nextWillUpdateAt() {
    if (!this.lastUpdatedAt) return _.now();
    return this.lastUpdatedAt + this.updatePeriodMinutes * 60 * 1000;
  }

  get started() {
    return this._started;
  }

  start() {
    if (!this.started) {
      this._started = true;
      this._setAlarm();
    }
  }

  stop() {
    if (this.started) {
      this._stopAlarm();
      this._started = false;
    }
  }

  reset() {
    this.lastUpdatedAt = _.now();
  }

  _bindAlarmEvents() {
    this.alarm.on("alarm", () => {
      if (!this.started) return;
      this.reset();
      this.emit("timer");
    });
  }

  _setAlarm() {
    if (!this.started) return;
    this.alarm.start({
      when: this.nextWillUpdateAt,
      periodInMinutes: this.updatePeriodMinutes,
    });
  }

  _stopAlarm() {
    return this.alarm.stop();
  }
}
