import _ from "lodash";
import fixture from "./fixture-loader";
import FakeXMLHttpRequest from "fake-xml-http-request";

export default function createFakeRequest(conf) {
  const responder = createResponder(conf);

  function FakeRequest() {
    FakeXMLHttpRequest.call(this);
  }
  FakeRequest.prototype = _.create(FakeXMLHttpRequest.prototype, {
    constructor: FakeRequest,
    send(...args) {
      setImmediate(() => { responder(this); });
      return FakeXMLHttpRequest.prototype.send.apply(this, args);
    },
  });

  return FakeRequest;
}

function createResponder(conf) {
  const routes = _.map(conf, (response, url) => {
    url = new RegExp(`^${url.split("*").map(_.escapeRegExp).join(".*")}$`);
    if (_.isString(response)) {
      const headers = {
        "Content-Type": /\.json$/.test(response) ? "application/json" : "text/html",
      };
      const fixturePath = response;
      response = () => [200, headers, fixture(fixturePath)];
    }
    return [url, response];
  });

  return (xhr) => {
    const url = xhr.url;
    const found = _.find(routes, route => route[0].test(url));
    let response = found && found[1];

    if (!response) {
      xhr.respond(404, {}, "");
      return;
    }
    if (_.isFunction(response)) {
      response = response(xhr);
    }
    xhr.respond.apply(xhr, response);
  };
}
