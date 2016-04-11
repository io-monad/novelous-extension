import ReactDOM from "react-dom";
import { test, sinonsb } from "../../common";
import OptionsController from "../../../app/scripts/lib/options/controller";
import AppData from "../../../app/scripts/lib/app/app-data";
import cutil from "../../../app/scripts/lib/util/chrome-util";
import isPromiseLike from "../../../app/scripts/lib/util/is-promise-like";

const hasWindow = !!global.window;
test.before(() => {
  global.window = global.window || { close: () => {} };
});
test.after(() => {
  if (!hasWindow) delete global.window;
});

test.beforeEach(t => {
  t.context.container = {};
  t.context.controller = new OptionsController(t.context.container);
});

function startController(t, appData) {
  const { controller } = t.context;
  sinonsb.stub(ReactDOM, "render");
  sinonsb.stub(cutil, "localGet").returns(Promise.resolve(appData || {}));
  return controller.start();
}

test("new OptionsController", t => {
  const { controller } = t.context;
  t.true(controller instanceof OptionsController);
});

test("#start returns Promise", t => {
  const { controller } = t.context;
  t.true(isPromiseLike(controller.start()));
});

test.serial("#start initializes members", t => {
  return startController(t).then(controller => {
    t.true(controller.appData instanceof AppData);
  });
});

test.serial("#start renders ReactDOM", t => {
  return startController(t).then(() => {
    const { container } = t.context;
    t.true(ReactDOM.render.calledOnce);
    t.is(ReactDOM.render.args[0][1], container);
  });
});

test.serial("#saveOptions saves AppData", t => {
  const closeStub = sinonsb.stub(window, "close");
  return startController(t).then(controller => {
    controller.saveOptions({ updatePeriodMinutes: 60 }).then(appData => {
      t.true(closeStub.calledOnce);
      t.is(appData.updatePeriodMinutes, 60);
    });
  });
});
