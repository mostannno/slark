import { Configuration } from "webpack";
import getCommonConfig from "./getCommonConfig";
import { merge } from "webpack-merge";
import path from "path";
import { rootPath } from "./context";

const getProdConfig = () => {
  const base = getCommonConfig();
  const prodConfig: Configuration = {
    entry: path.resolve(rootPath, "./src/main"),
    mode: "production",
    devtool: 'source-map',
    output: {
      path: path.resolve(rootPath, "./dist"),
      filename: "[name]-[contenthash].js",
      clean: true,
      publicPath: "/assets",
    },
  };
  return merge(base, prodConfig);
};

export default getProdConfig();
