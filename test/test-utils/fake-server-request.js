import _ from "lodash";
import FakeXMLHttpRequest from "fake-xml-http-request";
import fixture from "./fixture-loader";

export default function createFakeRequest(conf) {
  const responder = new Responder(conf);

  function FakeRequest() {
    FakeXMLHttpRequest.call(this);
  }
  FakeRequest.prototype = _.create(FakeXMLHttpRequest.prototype, {
    constructor: FakeRequest,
    send(...args) {
      setImmediate(() => {
        FakeRequest.responder.respond(this);
      });
      return FakeXMLHttpRequest.prototype.send.apply(this, args);
    },
  });
  FakeRequest.responder = responder;
  FakeRequest.addRoute = responder.addTemporaryRoute.bind(responder);
  FakeRequest.flush = responder.clearTemporaryRoutes.bind(responder);

  return FakeRequest;
}

class Responder {
  constructor(conf) {
    this.routes = [];
    this.temporaryRoutes = [];

    if (conf) {
      _.each(conf, (response, url) => {
        this.addRoute(url, response);
      });
    }
  }

  addRoute(url, response) {
    this.routes.push(this._createRoute(url, response));
  }

  addTemporaryRoute(url, response) {
    this.temporaryRoutes.push(this._createRoute(url, response));
  }

  clearTemporaryRoutes() {
    this.temporaryRoutes.length = 0;
  }

  _createRoute(url, response) {
    url = new RegExp(`^${url.split("*").map(_.escapeRegExp).join(".*")}$`);

    response = response || "OK";

    if (_.isString(response) && /\.(html|json)$/.test(response)) {
      const headers = {
        "Content-Type": /\.json$/.test(response) ? "application/json" : "text/html",
      };
      const fixturePath = response;
      response = () => [200, headers, fixture(fixturePath)];
    } else if (_.isString(response)) {
      response = [200, { "Content-Type": "text/html" }, response];
    } else if (_.isError(response)) {
      const error = response;
      response = () => { throw error; };
    }

    return [url, response];
  }

  respond(xhr) {
    const url = xhr.url;
    const found = (
      _.find(this.temporaryRoutes, route => route[0].test(url)) ||
      _.find(this.routes, route => route[0].test(url))
    );
    let response = found && found[1];

    if (!response) {
      xhr.respond(404, {}, "");
      return;
    }
    if (_.isFunction(response)) {
      response = response(xhr);
    }
    xhr.respond.apply(xhr, response);
  }
}
