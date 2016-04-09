import _ from "lodash";

export default function createExport(messageTypes) {
  const messageTypeMap = _.keyBy(messageTypes);

  function buildHandler(builder) {
    const handlers = {};

    { // Just for scoping variables
      const registry = _.clone(messageTypeMap);
      registry.on = function on(type, handler) {
        if (!messageTypeMap[type]) {
          throw new Error(`Unknown event type: ${type}`);
        }
        handlers[type] = handler;
        return this;
      };

      if (_.isFunction(builder)) {
        const returned = builder(registry);
        if (_.isObject(returned)) {
          _.each(returned, (value, key) => { registry.on(key, value); });
        }
      } else if (_.isObject(builder)) {
        _.each(builder, (value, key) => { registry.on(key, value); });
      } else {
        throw new Error("Unknown event handler builder");
      }
    }

    return (message, sender, sendResponse) => {
      if (!_.isObject(message) || !_.isString(message.type)) {
        console.error("Unknown message format received:", message);
        sendResponse({ error: "Unknown message format" });
        return false;
      }
      if (!messageTypeMap[message.type]) {
        console.error("Unknown event type received:", message.type);
        sendResponse({ error: "Unknown event type" });
        return false;
      }

      const type = message.type.toUpperCase();
      let ret = false;
      if (handlers[type]) {
        ret = handlers[type].call(null, message, sender, sendResponse);
        if (_.isObject(ret) && ret.then && ret.catch) {
          ret.then((result) => {
            sendResponse(result);
          }).catch((error) => {
            sendResponse({ error });
          });
          ret = true;
        }
      }
      return ret;
    };
  }

  return _.extend({}, messageTypeMap, {
    buildHandler,
  });
}
