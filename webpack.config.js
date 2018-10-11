const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const path = require("path");
const globSync = require('glob').sync;

module.exports = (env, options) => ({
  entry: ["./src/index.js"],
  devServer: {
    contentBase: "./dist"
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: [
          options.mode !== "production"
            ? "style-loader"
            : MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(png|jpg|gif|jpeg|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "./img/"
            }
          }
        ]
      },
      {
        test: /\.(html)$/,
        use: {
          loader: "html-loader",
          options: {
            attrs: [":src"]
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["env"]
          }
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash].css",
    }),
    new CleanWebpackPlugin(["dist"]),
    ...globSync('src/**/*.html').map((fileName) => {
      return new HtmlWebpackPlugin({
        template: fileName,
        inject: "body",
        filename: fileName.replace('src/', '')
      })
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      Popper: ["popper.js", "default"],
      Util: "exports-loader?Util!bootstrap/js/dist/util",
      Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown"
    }),
    new HtmlWebpackPlugin({
      template: "src/campus-life/clubs-at-cea/trace-cea.html",
      inject: "body",
      filename: "clubs-at-cea/trace-cea.html"
    }),
    new HtmlWebpackPlugin({
      template: "src/news-and events/whats-coming-up.html",
      inject: "body",
      filename: "news-and events/whats-coming-up.html"
    })
  ],
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: options.mode === "production" ?'https://ceadoor.github.io/cea.ac.in/':'http://localhost:8080/'
  }
});
