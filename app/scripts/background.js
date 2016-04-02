import "./lib/background/livereload";
import background from "./lib/background/index";
if (__ENV__ === "development") debug.enable("*");
background();
