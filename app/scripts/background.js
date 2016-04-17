import "./lib/util/debug";
import "./lib/background/livereload";
import BackgroundController from "./lib/background/controller";
import buildAPI from "./lib/background/api";

const controller = new BackgroundController;
controller.start();

global.NovelousAPI = buildAPI(controller);

if (__ENV__ === "development") {
  const Debugger = require("./lib/background/debugger").default;
  global.NovelousDebug = new Debugger(controller);
}
