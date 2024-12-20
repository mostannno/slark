import path from "path";
import { Configuration } from "webpack";
import MiniCssExtraPlugin from "mini-css-extract-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { rootPath } from "./context";

function getCommonConfig(): Configuration {
  return {
    entry: "src/main",
    resolve: {
      extensions: [".ts", ".js", ".jsx", ".tsx"],
      alias: {
        widgets: path.resolve(rootPath, "./src/widgets/"),
        assets: path.resolve(rootPath, "./src/assets/"),
        shared: path.resolve(rootPath, "./src/shared/"),
        entities: path.resolve(rootPath, "./src/entities/"),
      },
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtraPlugin.loader, "css-loader"],
          exclude: /(node_modules)/,
        },
        {
          test: /\.(t|j)sx?$/,
          exclude: /(node_modules)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-typescript",
                "@babel/preset-react",
              ],
              plugins: [
                "@babel/plugin-proposal-object-rest-spread",
                ["@babel/plugin-transform-react-jsx", { runtime: "automatic" }],
              ],
            },
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "Slark",
        template: "index.html",
        filename: "index.html",
        minify: {
          removeComments: true,
          collapseWhitespace: true,
        },
      }),
      new MiniCssExtraPlugin({
        filename: "[name].[contenthash].css",
        chunkFilename: "[id].[contenthash].css",
      }),
    ],
  };
}

export default getCommonConfig;
