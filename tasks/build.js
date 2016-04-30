import gulp from "gulp";
import gulpSequence from "gulp-sequence";

gulp.task("build", gulpSequence(
  "clean", [
    "manifest",
    "license",
    "scripts",
    "vendor",
    "styles",
    "pages",
    "locales",
    "images",
    "sounds",
    "fonts",
    "livereload",
  ]
));
