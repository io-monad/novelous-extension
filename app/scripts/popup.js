import "./lib/util/debug";
import PopupController from "./lib/popup/controller";

const controller = new PopupController(document.getElementById("container"));
controller.start();
