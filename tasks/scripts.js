import gulp from "gulp";
import gulpif from "gulp-if";
import webpack from "webpack";
import gulpWebpack from "webpack-stream";
import named from "vinyl-named";
import plumber from "gulp-plumber";
import livereload from "gulp-livereload";
import args from "./lib/args";

function getWebpackConfig() {
  return {
    devtool: args.sourcemaps ? "source-map" : null,
    watch: args.watch,
    plugins: [
      new webpack.DefinePlugin({
        __ENV__: JSON.stringify(args.production ? "production" : "development"),
        __VENDOR__: JSON.stringify(args.vendor),
        LIVERELOAD: args.watch,
      }),
    ].concat(args.production ? [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
    ] : []),
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: "babel",
          exclude: /node_modules/,
        },
        {
          test: /\.json$/,
          loader: "json",
          exclude: /node_modules/,
        },
      ],
    },
  };
}

gulp.task("scripts", () => {
  return gulp.src("app/scripts/*.js")
    .pipe(plumber())
    .pipe(named())
    .pipe(gulpWebpack(getWebpackConfig()))
    .pipe(gulp.dest(`dist/${args.vendor}/scripts`))
    .pipe(gulpif(args.watch, livereload()));
});
