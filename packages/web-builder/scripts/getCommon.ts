import type { Configuration } from "webpack";
import MiniCssExtraPlugin from "mini-css-extract-plugin";

export const getCommonConfig = () => {
  const config: Configuration = {
    entry: "src/main",
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtraPlugin.loader, "css-loader"],
        },
      ],
    },
    plugins: [new MiniCssExtraPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })],
  };
  return config
};
