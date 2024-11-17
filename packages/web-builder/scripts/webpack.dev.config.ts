import type { Configuration } from "webpack";
import merge from "webpack-merge";
import { getCommonConfig } from "./getCommon";

const createDevConfig = () => {
  const base = getCommonConfig();
  const devConfig: Configuration = {
    mode: "development",
    output: {
      filename: "bundle.js",
    },
  };
  return merge(base, devConfig);
};

export default createDevConfig;
