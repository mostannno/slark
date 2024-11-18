import { merge } from "webpack-merge";
import { Configuration } from "webpack";
import path from "path";
import { rootPath } from "./context";
import getCommonConfig from "./getCommonConfig";

const getDevConfig = () => {
  const base = getCommonConfig();
  const devConfig: Configuration = {
    entry: path.resolve(rootPath, "./src/main"),
    mode: "development",
    output: {
      path: path.resolve(rootPath, "./dist"),
      filename: "bundle.js",
    },
  };
  return merge(base, devConfig);
};

export default getDevConfig();
