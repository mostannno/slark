import { merge } from "webpack-merge";
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import type { Configuration } from "webpack";
import path from "path";
import { rootPath } from "./context";
import getCommonConfig from "./getCommonConfig";

const getDevConfig = () => {
  const base = getCommonConfig();
  const devConfig: Configuration & DevServerConfiguration = {
    context: rootPath,
    entry: path.resolve(rootPath, "./src/main"),
    mode: "development",
    devServer: {
      hot: true,
      historyApiFallback: true,
      compress: true,
      liveReload: true,
    },
    devtool: "eval-source-map",
    output: {
      filename: "[name]-[contenthash].js",
      clean: true,
      publicPath: "/",
    },
  };
  return merge(base, devConfig);
};

export default getDevConfig();
