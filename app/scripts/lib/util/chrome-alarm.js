import EventEmitter from "eventemitter3";

/**
 * A simple wrapper for chrome.alarms API
 */
export default class ChromeAlarm extends EventEmitter {
  constructor(name) {
    super();
    this.name = name;
    this.logger = debug(`alarm:${name}`);
    this._bindAlarmEvent();
  }

  start(options) {
    chrome.alarms.create(this.name, options);
    this.logger("Set alarm", "options:", options);
  }

  stop() {
    return new Promise(resolve => {
      chrome.alarms.clear(this.name, wasCleared => {
        this.logger("Stopped", "wasCleared:", wasCleared);
        resolve(wasCleared);
      });
    });
  }

  _bindAlarmEvent() {
    chrome.alarms.onAlarm.addListener(alarm => {
      if (alarm.name === this.name) {
        if (this.logger.enabled) {
          this.logger(`Alarm ringing at ${(new Date()).toLocaleString()}`);
          if (alarm.periodInMinutes !== null) {
            const next = new Date(+(new Date) + alarm.periodInMinutes * 60 * 1000);
            this.logger(`Next will be ${next.toLocaleString()}`);
          }
        }

        this._emitAlarm();
      }
    });
  }

  _emitAlarm() {
    this.emit("alarm");
  }
}
