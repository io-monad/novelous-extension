import gulp from "gulp";
import gutil from "gulp-util";
import build from "webpack-build";
import args from "./lib/args";

gulp.task("scripts", (cb) => {
  build({
    config: `${__dirname}/../webpack.config.js`,
    watch: args.watch,
    args,
  }, (err, data) => {
    if (data) {
      data.stats.errors.forEach(e => {
        gutil.log(gutil.colors.red("WebPack Error:"), e);
      });
      data.stats.warnings.forEach(w => {
        gutil.log(gutil.colors.yellow("WebPack Warning:"), w);
      });
      data.stats.assets.forEach(a => {
        gutil.log(
          " *", gutil.colors.green(a.name),
          gutil.colors.cyan(humanizeSize(a.size))
        );
      });
    }
    cb(err);
  });
});

function humanizeSize(size) {
  if (size > 1024 * 1024) return `${Math.round(size / 1024 / 1024)} MB`;
  if (size > 1024) return `${Math.round(size / 1024)} KB`;
  return `${size} bytes`;
}
