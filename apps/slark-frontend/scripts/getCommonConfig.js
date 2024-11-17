const MiniCssExtraPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

function getCommonConfig() {
  return {
    entry: "src/main",
    resolve: {
      extensions: [".ts", ".js", ".jsx", ".tsx"],
      alias: {
        widgets: path.resolve(__dirname, "../src/widgets/"),
        assets: path.resolve(__dirname, "../src/assets/"),
        shared: path.resolve(__dirname, "../src/shared/"),
        entities: path.resolve(__dirname, "../src/entities/"),
      },
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtraPlugin.loader, "css-loader"],
        },
        {
          test: /\.(t|j)sx?$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-typescript",
                "@babel/preset-react",
              ],
              plugins: ["@babel/plugin-proposal-object-rest-spread"],
            },
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "Slark",
        template: "index.html",
        filename: "slark.html",
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

module.exports = getCommonConfig;
