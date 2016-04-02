import content from "./lib/content/index";
if (__ENV__ === "development") debug.enable("*");
content();
