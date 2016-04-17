import ReactDOM from "react-dom";
import { assert, sinonsb } from "../../common";
import OptionsController from "../../../app/scripts/lib/options/controller";
import AppData from "../../../app/scripts/lib/app/app-data";
import cutil from "../../../app/scripts/lib/util/chrome-util";
import isPromiseLike from "../../../app/scripts/lib/util/is-promise-like";

describe("OptionsController", () => {
  let container;
  let controller;

  const hasWindow = !!global.window;
  before(() => {
    global.window = global.window || { close: () => {} };
  });
  after(() => {
    if (!hasWindow) delete global.window;
  });

  beforeEach(() => {
    container = {};
    controller = new OptionsController(container);
  });

  function startController(appData) {
    sinonsb.stub(ReactDOM, "render");
    sinonsb.stub(cutil, "localGet").returns(Promise.resolve(appData || {}));
    return controller.start();
  }

  it("new OptionsController", () => {
    assert(controller instanceof OptionsController);
  });

  describe("#start", () => {
    it("returns Promise", () => {
      assert(isPromiseLike(controller.start()));
    });

    it("initializes members", () => {
      return startController().then(() => {
        assert(controller.appData instanceof AppData);
      });
    });

    it("renders ReactDOM", () => {
      return startController().then(() => {
        assert(ReactDOM.render.calledOnce);
        assert(ReactDOM.render.args[0][1] === container);
      });
    });
  });

  describe("#saveOptions", () => {
    it("saves AppData", () => {
      const closeStub = sinonsb.stub(window, "close");
      return startController().then(() => {
        controller.saveOptions({ updatePeriodMinutes: 60 }).then(appData => {
          assert(closeStub.calledOnce);
          assert(appData.updatePeriodMinutes === 60);
        });
      });
    });
  });
});
