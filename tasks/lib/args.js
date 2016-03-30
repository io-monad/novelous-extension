import yargs from "yargs";

const args = yargs

  .option("production", {
    boolean: true,
    default: false,
    describe: "Minify all scripts and assets",
  })

  .option("watch", {
    boolean: true,
    default: false,
    describe: "Watch all files and start a livereload server",
  })

  .option("verbose", {
    boolean: true,
    default: false,
    describe: "Log additional data",
  })

  .option("vendor", {
    string: true,
    default: "chrome",
    describe: "Compile the extension for different vendors",
    choices: ["chrome", "moz", "opera"],
  })

  .option("sourcemaps", {
    describe: "Force the creation of sourcemaps",
  })

  .option("serial", {
    boolean: true,
    default: false,
    describe: "Run tests in serial mode",
  })

  .argv;

// Use production flag for sourcemaps
// as a fallback
if (typeof args.sourcemaps === "undefined") {
  args.sourcemaps = !args.production;
}

export default args;
