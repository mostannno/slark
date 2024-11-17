const getCommonConfig = require("./getCommonConfig");
const { merge } = require("webpack-merge");
const path = require("path");

const getDevConfig = () => {
  const base = getCommonConfig();
  const devConfig = {
    entry: path.resolve(__dirname, "../src/main"),
    mode: "development",
    output: {
      path: path.resolve(__dirname, "../dist"),
      filename: "bundle.js",
    },
  };
  return merge(base, devConfig);
};

console.log("config", getDevConfig());

module.exports = getDevConfig();
