import fs from "fs";
import gulp from "gulp";
import gutil from "gulp-util";
import gulpSequence from "gulp-sequence";
import packageJson from "../package.json";

gulp.task("release", gulpSequence("release:version", "pack"));

gulp.task("release:version", () => {
  const newVersion = packageJson.version;
  if (!newVersion) {
    throw new Error("No version in package.json. Do not run this task on local!");
  }

  const manifest = JSON.parse(fs.readFileSync("app/manifest.json"));
  manifest.version = newVersion;
  fs.writeFileSync("app/manifest.json", JSON.stringify(manifest, null, 2));
  gutil.log("Updated manifest.json with version", gutil.colors.cyan(newVersion));

  const releaseTag = `v${newVersion}`;
  fs.writeFileSync("VERSION", releaseTag);
  gutil.log("Created VERSION file");
});
