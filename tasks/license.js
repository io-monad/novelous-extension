import gulp from "gulp";
import args from "./lib/args";

gulp.task("license", () => {
  return gulp.src("LICENSE.txt")
    .pipe(gulp.dest(`dist/${args.vendor}`));
});
