import gulp from "gulp";
import gulpif from "gulp-if";
import livereload from "gulp-livereload";
import jsonTransform from "gulp-json-transform";
import plumber from "gulp-plumber";
import args from "./lib/args";

gulp.task("manifest", () => {
  return gulp.src("app/manifest.json")
    .pipe(plumber())
    .pipe(jsonTransform((manifest) => {
      const newManifest = {};
      Object.keys(manifest).forEach((key) => {
        const match = key.match(/^__(\w+)__(.*)/);
        if (match) {
          if (match[1] === args.vendor) {
            newManifest[match[2]] = manifest[key];
          }
        } else {
          newManifest[key] = manifest[key];
        }
      });
      return newManifest;
    }, 2))
    .pipe(gulp.dest(`dist/${args.vendor}`))
    .pipe(gulpif(args.watch, livereload()));
});
