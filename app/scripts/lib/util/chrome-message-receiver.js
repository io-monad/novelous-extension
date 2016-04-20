import _ from "lodash";
import isPromiseLike from "./is-promise-like";

/**
 * Message receiver base class for Chrome messaging spec.
 */
export default class ChromeMessageReceiver {
  // eslint-disable-next-line valid-jsdoc
  /**
   * @return {string[]} Known message types.
   *     This should be static since it will be cached.
   * @abstract
   */
  static getMessageTypes() {
    throw new Error("getMessageTypes must be overridden");
  }

  /**
   * @return {Map.<string, string>} Map of known message types.
   *     Both keys and values are message types.
   */
  static getMessageTypeMap() {
    if (!this._messageTypeMap) {
      this._messageTypeMap = _.keyBy(this.getMessageTypes());
    }
    return this._messageTypeMap;
  }

  // eslint-disable-next-line valid-jsdoc
  /**
   * @param {Map.<string, string>} t - Map of known message types.
   *     Both keys and values are message types. Just for shorthand.
   * @return {Map.<string, Fuunction>} Map of message type to handler method.
   * @abstract
   */
  _getMessageHandlerMapping(t) {  // eslint-disable-line
    throw new Error("getMessageHandlerMapping must be overridden");
  }

  /**
   * @param {string} name - Name of message receiver.
   */
  constructor(name) {
    this.name = name;
    this.logger = debug(`message:${name}`);
    this.messageTypes = this.constructor.getMessageTypes();
    this.messageTypeMap = this.constructor.getMessageTypeMap();
    this.listener = this.receive.bind(this);
    this._handlers = this._buildHandlers();
  }

  /**
   * @return {Map.<string, Function>}
   */
  _buildHandlers() {
    const handlerMap = this._getMessageHandlerMapping(this.messageTypeMap);

    return _.mapKeys(handlerMap, (method, key) => {
      if (!this.messageTypeMap[key]) {
        throw new Error(`getMessageHandlerMapping: Unknown message type "${key}"`);
      }
      if (!_.isFunction(method)) {
        throw new Error(`getMessageHandlerMapping: Non-Function method for ${key}`);
      }
      return key.toUpperCase();
    });
  }

  /**
   * Receive a message and dispatch it to a message handler.
   *
   * Use `this.listener` for `addListener` of incoming message event.
   * It is a wrapped version of `receive` by `bind(this)`.
   *
   * @param {Object} message - Received message.
   * @param {Object} sender - Sender information.
   * @param {Function} sendResponse - Callback function to send reponse.
   * @return {boolean} Whether sendResponse is called asynchronously.
   */
  receive(message, sender, sendResponse) {
    this.logger("Received message", message, sender);

    if (!_.isObject(message) || !_.isString(message.type)) {
      console.error("Unknown message format received:", message);
      sendResponse({ error: "Unknown message format" });
      return false;
    }

    const type = message.type.toUpperCase();
    if (!this.messageTypeMap[type]) {
      console.error("Unknown message type received:", message.type);
      sendResponse({ error: "Unknown message type" });
      return false;
    }

    let ret = false;
    const handler = this._handlers[type];
    if (handler) {
      ret = handler.call(this, message, sender, sendResponse);
      this.logger("Message handler returned", ret, ", message:", message);

      if (isPromiseLike(ret)) {
        ret.then(response => sendResponse(response));
        ret.catch(error => sendResponse({ error }));
        ret = true;  // Mark as async response
      }
    } else {
      this.logger("Skipped message (no handler)");
    }
    return ret;
  }
}
