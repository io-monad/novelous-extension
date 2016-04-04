import "./lib/util/debug";
import "./lib/background/livereload";
import BackgroundController from "./lib/background/controller";
import buildAPI from "./lib/background/api";

const controller = new BackgroundController;
controller.start();

global.NovelousAPI = buildAPI(controller);
