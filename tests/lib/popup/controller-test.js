import ReactDOM from "react-dom";
import { test, sinonsb } from "../../common";
import PopupController from "../../../app/scripts/lib/popup/controller";
import BackgroundAPI from "../../../app/scripts/lib/popup/background-api";
import AppData from "../../../app/scripts/lib/app/app-data";
import Subscriber from "../../../app/scripts/lib/subscriptions/subscriber";
import cutil from "../../../app/scripts/lib/util/chrome-util";

test.beforeEach(t => {
  t.context.container = {};
  t.context.controller = new PopupController(t.context.container);
});

function startController(t, appData) {
  const { controller } = t.context;
  sinonsb.stub(ReactDOM, "render");
  sinonsb.stub(cutil, "localGet").returns(Promise.resolve(appData || {}));
  sinonsb.stub(BackgroundAPI, "updateSubscriptions").returns(Promise.resolve(new Subscriber));
  sinonsb.stub(BackgroundAPI, "getAppData").returns(Promise.resolve(new AppData(appData)));
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

test.serial("#start triggers updateSubscriptions when never updated", t => {
  return startController(t).then(() => {
    t.true(BackgroundAPI.updateSubscriptions.called);
  });
});

test.serial("#start not triggers updateSubscriptions when updated once", t => {
  return startController(t, { lastUpdatedAt: 1234567890 }).then(() => {
    t.false(BackgroundAPI.updateSubscriptions.called);
  });
});

test.serial("#start renders ReactDOM", t => {
  return startController(t, { lastUpdatedAt: 1234567890 }).then(() => {
    const { container } = t.context;
    t.true(ReactDOM.render.calledOnce);
    t.is(ReactDOM.render.args[0][1], container);
  });
});
