const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const fs = require("fs");

const version = JSON.parse(fs.readFileSync("./package.json")).version;
const baseConfig = {
  entry: "./src/index.ts",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"], // 包含你使用的扩展名
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
  optimization: {
    // minimize: true,

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
};
const umdConfig = {
  name: "umd",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: `monitor.umd.${version}.js`, // 使用 contenthash 进行缓存控制
    // filename: "monitor.js",
    clean: false, // 替代 clean-webpack-plugin

  },

  // {
  //   path: path.resolve(__dirname, "dist"),
  //   filename: `monitor.umd.${version}.js`,

  // },
  // ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"), // 设置静态文件目录
    },
    compress: true,
    port: 3000,
    open: true,
    proxy: [],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      inject: "head", // 将 JavaScript 插入到 <head> 部分
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "public/createError.js", to: "createError.js" }],
    }),
  ],

};
const cmdConfig = {
  name: "cmd",
  output:
  {
    path: path.resolve(__dirname, "dist"),
    filename: `monitor.cjs.${version}.js`,
    library: {
      type: "commonjs2", // CommonJS 模块
    },
    clean: false,
  },
};
const esmConfig = {
  name: "esm",
  output:
  {
    path: path.resolve(__dirname, "dist"),
    filename: `monitor.esm.${version}.js`,
    library: {
      type: "module", // ESM 模块
    },
    clean: false,
  },
  experiments: {
    outputModule: true, // 启用 ESM 模块支持
  },
  mode: "production", // 生产模式

};
module.exports = [
  { ...baseConfig, ...umdConfig },
  { ...baseConfig, ...cmdConfig },
  { ...baseConfig, ...esmConfig },
];
