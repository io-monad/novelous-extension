import { spawn } from "child_process";
import gulp from "gulp";
import args from "./lib/args";

function runAva(options, done) {
  const avaArgs = [];
  ["verbose", "watch", "serial"].forEach(opt => {
    if (options[opt]) avaArgs.push(`--${opt}`);
  });
  spawn("node_modules/.bin/ava", avaArgs, { stdio: "inherit" })
  .on("close", code => {
    if (code !== 0) {
      done(`ava exited with code ${code}.`);
    } else {
      done();
    }
  });
}

gulp.task("test", (done) => {
  runAva(args, done);
});

gulp.task("test:watch", (done) => {
  runAva(Object.assign({}, args, { watch: true }), done);
});
