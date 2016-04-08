import ReactDOM from "react-dom";
import { test, sinonsb } from "../../common";
import PopupController from "../../../app/scripts/lib/popup/controller";
import AppData from "../../../app/scripts/lib/app/app-data";
import Subscriber from "../../../app/scripts/lib/subscriptions/subscriber";
import cutil from "../../../app/scripts/lib/util/chrome-util";

test.beforeEach(t => {
  t.context.container = {};
  t.context.controller = new PopupController(t.context.container);
});

function startController(t, appData) {
  const { controller } = t.context;
  t.context.stubRender = sinonsb.stub(ReactDOM, "render");
  sinonsb.stub(cutil, "localGet").returns(Promise.resolve(appData || {}));
  return controller.start();
}

test("new PopupController", t => {
  const { controller } = t.context;
  t.true(controller instanceof PopupController);
});

test("#start returns Promise", t => {
  const { controller } = t.context;
  t.true(controller.start() instanceof Promise);
});

test.serial("#start initializes members", t => {
  return startController(t).then(controller => {
    t.true(controller.appData instanceof AppData);
    t.true(controller.subscriber instanceof Subscriber);
  });
});

test.serial("#start renders ReactDOM", t => {
  return startController(t).then(() => {
    const { container, stubRender } = t.context;
    t.true(stubRender.calledOnce);
    t.is(stubRender.args[0][1], container);
  });
});
