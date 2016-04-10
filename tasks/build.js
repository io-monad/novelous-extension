import gulp from "gulp";
import gulpSequence from "gulp-sequence";

gulp.task("build", gulpSequence(
  "clean", "lint", [
    "manifest",
    "license",
    "scripts",
    "vendor",
    "styles",
    "pages",
    "locales",
    "images",
    "fonts",
    "livereload",
  ]
));
