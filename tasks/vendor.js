import gulp from "gulp";
import gulpif from "gulp-if";
import concat from "gulp-concat";
import uglify from "gulp-uglify";
import through from "through2";
import args from "./lib/args";

gulp.task("vendor", () => {
  return gulp.src([
    "node_modules/lodash/lodash.min.js",
    "bower_components/visionmedia-debug/Readme.md",
    "bower_components/visionmedia-debug/dist/debug.js",
  ])
  .pipe(gulpif(f => /Readme\.md$/i.test(f.path), licenseHeader()))
  .pipe(uglify({ preserveComments: "license" }))
  .pipe(concat("vendor.js"))
  .pipe(gulp.dest(`dist/${args.vendor}/scripts`));
});

function licenseHeader() {
  return through.obj((file, enc, done) => {
    const content = file.contents.toString();
    const title = content.match(/^# *(.+)$/m)[1];
    const license = content.match(/\n#+ *License\n((?:.|\n)+?)(?:\n#|$)/i)[1];
    const header = `${title}\n\n${license.replace(/^\n+|\n+$/g, "")}`;
    file.contents = new Buffer(`/*!\n${header.replace(/^/mg, " * ")}\n */`);
    return done(null, file);
  });
}
