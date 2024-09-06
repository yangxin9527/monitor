const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const fs = require("fs");

const version = JSON.parse(fs.readFileSync("./version.json")).version;

module.exports = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: `monitor.${version}.js`, // 使用 contenthash 进行缓存控制
    // filename: "monitor.js",
    clean: true, // 替代 clean-webpack-plugin
  },
  // 其他配置
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"], // 包含你使用的扩展名
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"), // 设置静态文件目录
    },
    compress: true,
    port: 3000,
    open: true,
    proxy: [],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.ts$/, // 匹配所有 .ts 文件
        use: "ts-loader", // 使用 ts-loader 处理
        exclude: /node_modules/, // 排除 node_modules 文件夹
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      inject: "head", // 将 JavaScript 插入到 <head> 部分
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "public/createError.js", to: "createError.js" },
      ],
    }),
  ],
  optimization: {
    splitChunks: false, // 禁用代码拆分

    // splitChunks: {
    //   chunks: "all",
    // },
    minimizer: [
      new TerserPlugin({
        extractComments: false, // 禁用许可证提取
      }),
    ],
  },
//   cache: {
//     type: "filesystem", // 启用文件系统缓存
//   },
};
