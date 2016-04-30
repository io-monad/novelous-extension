import gulp from "gulp";
import { colors, log } from "gulp-util";
import zip from "gulp-zip";
import packageDetails from "../package.json";
import args from "./lib/args";

function getPackExtension() {
  switch (args.vendor) {
    case "moz":
      return ".xpi";
    default:
      return ".zip";
  }
}

gulp.task("pack", ["build"], () => {
  const name = packageDetails.name.replace(/^@[\w-]+\//, "");
  const version = packageDetails.version;
  const extname = getPackExtension();
  const filename = `${name}-${version}-${args.vendor}${extname}`;
  return gulp.src(`dist/${args.vendor}/**/*`)
    .pipe(zip(filename))
    .pipe(gulp.dest("./packages"))
    .on("end", () => {
      const distStyled = colors.magenta(`dist/${args.vendor}`);
      const filenameStyled = colors.magenta(`./packages/${filename}`);
      log(`Packed ${distStyled} to ${filenameStyled}`);
    });
});
