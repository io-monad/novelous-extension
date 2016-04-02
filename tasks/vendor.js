import gulp from "gulp";
import concat from "gulp-concat";
import args from "./lib/args";

gulp.task("vendor", () => {
  return gulp.src([
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/lodash/lodash.min.js",
    "bower_components/visionmedia-debug/dist/debug.js",
  ])
  .pipe(concat("vendor.js"))
  .pipe(gulp.dest(`dist/${args.vendor}/scripts`));
});
