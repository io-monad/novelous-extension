import fs from "fs";
import gulp from "gulp";
import { colors, log } from "gulp-util";
import gulpSequence from "gulp-sequence";
import zip from "gulp-zip";
import deploy from "chrome-extension-deploy";
import packageJson from "../package.json";
import args from "./lib/args";

gulp.task("release", gulpSequence(
  "release:version",
  "release:pack",
  "release:upload"
));

gulp.task("release:version", () => {
  const newVersion = packageJson.version;
  const manifest = JSON.parse(fs.readFileSync("app/manifest.json"));
  manifest.version = newVersion;
  fs.writeFileSync("app/manifest.json", JSON.stringify(manifest, null, 2));
  log("Updated manifest.json with version", colors.cyan(newVersion));
});

gulp.task("release:pack", ["build"], () => {
  const filename = getZipFilename();
  return gulp.src(`dist/${args.vendor}/**/*`)
    .pipe(zip(filename))
    .pipe(gulp.dest("./packages"))
    .on("end", () => {
      const distStyled = colors.magenta(`dist/${args.vendor}`);
      const filenameStyled = colors.magenta(`packages/${filename}`);
      log(`Packed ${distStyled} to ${filenameStyled}`);
    });
});

gulp.task("release:upload", (done) => {
  if (args.vendor !== "chrome") {
    log("Skipped (Target vendor is not `chrome`)");
    done();
    return;
  }
  if (!process.env.WEBSTORE_CLIENT_ID ||
      !process.env.WEBSTORE_CLIENT_SECRET ||
      !process.env.WEBSTORE_REFRESH_TOKEN) {
    throw new Error("Credential for Chrome Web Store is not set");
  }

  const filename = `packages/${getZipFilename()}`;
  deploy({
    clientId: process.env.WEBSTORE_CLIENT_ID,
    clientSecret: process.env.WEBSTORE_CLIENT_SECRET,
    refreshToken: process.env.WEBSTORE_REFRESH_TOKEN,
    id: packageJson.chromeExtensionId,
    zip: fs.readFileSync(filename),
  })
  .then(() => {
    log(`Uploaded ${colors.magenta(filename)} to Chrome Web Store`);
    done();
  })
  .catch(done);
});

function getZipFilename() {
  const name = packageJson.name.replace(/^@[\w-]+\//, "");
  const version = packageJson.version;
  const extname = args.vendor === "moz" ? ".xpi" : ".zip";
  return `${name}-${version}-${args.vendor}${extname}`;
}
