import "babel-polyfill";
import "./lib/util/debug";
import OptionsController from "./lib/options/controller";

const controller = new OptionsController(document.getElementById("container"));
controller.start();
