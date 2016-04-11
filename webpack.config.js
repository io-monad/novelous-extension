/* eslint-disable no-var, prefer-template */
var webpack = require("webpack");

module.exports = function webpackConfig(opts) {
  var env = JSON.stringify(opts.args.production ? "production" : "development");

  var config = {
    entry: {
      background: __dirname + "/app/scripts/background.js",
      options: __dirname + "/app/scripts/options.js",
      popup: __dirname + "/app/scripts/popup.js",
    },
    output: {
      path: __dirname + "/dist/" + opts.args.vendor + "/scripts",
      filename: "[name].js",
      publicPath: "/scripts/",
    },
    plugins: [
      new webpack.IgnorePlugin(/^(buffertools)$/),
      new webpack.DefinePlugin({
        __ENV__: env,
        __VENDOR__: JSON.stringify(opts.args.vendor),
        LIVERELOAD: opts.watch,
      }),
      new webpack.optimize.CommonsChunkPlugin("common-frontend.js", ["options", "popup"]),
      new webpack.optimize.CommonsChunkPlugin("common.js"),
    ],
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: "babel",
          exclude: /(node_modules|bower_components)/,
          query: {
            cacheDirectory: true,
          },
        },
        {
          test: /\.json$/,
          loader: "json",
        },
      ],
    },
    devtool: opts.args.sourcemaps ? "inline-source-map" : null,
  };

  if (opts.args.production) {
    config.plugins.push(
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
    );
  }

  return config;
};
