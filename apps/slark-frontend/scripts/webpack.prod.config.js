const getCommonConfig = require("./getCommonConfig");
const { merge } = require("webpack-merge");
const path = require("path");

const getProdConfig = () => {
  const base = getCommonConfig();
  const prodConfig = {
    entry: path.resolve(__dirname, "../src/main"),
    mode: "production",
    output: {
      path: path.resolve(__dirname, "../dist"),
      filename: "[name]-[contenthash].js",
      clean: true,
      publicPath: '/assets'
    },
  };
  return merge(base, prodConfig);
};

module.exports = getProdConfig();
