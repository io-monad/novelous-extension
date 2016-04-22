import ReactDOM from "react-dom";
import isPromise from "is-promise";
import { storage } from "@io-monad/chrome-util";
import { assert, sinonsb, factory } from "../../common";
import PopupController from "../../../app/scripts/lib/popup/controller";
import BackgroundAPI from "../../../app/scripts/lib/popup/background-api";
import AppData from "../../../app/scripts/lib/app/app-data";
import Subscriber from "../../../app/scripts/lib/subscriptions/subscriber";

describe("PopupController", () => {
  let container;
  let controller;

  beforeEach(() => {
    container = {};
    controller = new PopupController(container);
  });

  function startController(appData) {
    sinonsb.stub(ReactDOM, "render");
    sinonsb.stub(storage, "localGet").returns(Promise.resolve(appData || {}));
    sinonsb.stub(BackgroundAPI, "updateSubscriptions").returns(Promise.resolve(new Subscriber));
    sinonsb.stub(BackgroundAPI, "getAppData").returns(Promise.resolve(new AppData(appData)));
    return controller.start();
  }

  it("new PopupController", () => {
    assert(controller instanceof PopupController);
  });

  describe("#start", () => {
    it("returns Promise", () => {
      assert(isPromise(controller.start()));
    });

    it("initializes members", () => {
      return startController().then(() => {
        assert(controller.appData instanceof AppData);
        assert(controller.subscriber instanceof Subscriber);
      });
    });

    it("triggers updateSubscriptions when never updated", () => {
      return startController().then(() => {
        assert(BackgroundAPI.updateSubscriptions.called);
      });
    });

    it("not triggers updateSubscriptions when updated once", () => {
      const subscriptionSettings = [factory.buildSync("itemsSubscriptionData")];
      return startController({ subscriptionSettings }).then(() => {
        assert(!BackgroundAPI.updateSubscriptions.called);
      });
    });

    it("renders ReactDOM", () => {
      const subscriptionSettings = [factory.buildSync("itemsSubscriptionData")];
      return startController({ subscriptionSettings }).then(() => {
        assert(ReactDOM.render.calledOnce);
        assert(ReactDOM.render.args[0][1] === container);
      });
    });
  });
});
