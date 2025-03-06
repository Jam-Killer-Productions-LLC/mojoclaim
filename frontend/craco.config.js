// craco.config.js
const webpack = require("webpack");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add fallbacks for Node.js core modules
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        stream: require.resolve("stream-browserify"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        zlib: require.resolve("browserify-zlib"),
      };

      // Optionally provide process and Buffer to the project
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: "process/browser",
          Buffer: ["buffer", "Buffer"],
        })
      );
      
      return webpackConfig;
    },
  },
};