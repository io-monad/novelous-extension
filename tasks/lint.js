import gulp from "gulp";
import eslint from "gulp-eslint";

gulp.task("lint", () => {
  return gulp.src("app/scripts/**/*.js")
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
