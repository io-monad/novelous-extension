import EventEmitter from "eventemitter3";

/**
 * A simple wrapper for chrome.alarms API
 */
export default class ChromeAlarm extends EventEmitter {
  constructor(name) {
    super();
    this.name = name;
    this._bindAlarmEvent();
  }

  start(options) {
    chrome.alarms.create(this.name, options);
  }

  startImmediate(options) {
    this.start(options);
    this._emitAlarm();
  }

  stop() {
    return new Promise(resolve => {
      chrome.alarms.clear(this.name, wasCleared => {
        resolve(wasCleared);
      });
    });
  }

  _bindAlarmEvent() {
    chrome.alarms.onAlarm.addListener(alarm => {
      if (alarm.name === this.name) {
        this._emitAlarm();
      }
    });
  }

  _emitAlarm() {
    this.emit("alarm");
  }
}
