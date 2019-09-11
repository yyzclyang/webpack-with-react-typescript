const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const getDirNames = require("./getDirNames");
const dirNames = getDirNames();

module.exports = {
  entry: getEntry(),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]/index.bundle.[hash].js",
    publicPath: "/"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "awesome-typescript-loader"
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ],
        include: path.join(__dirname, "src"), //限制范围，提高打包速度
        exclude: /node_modules/
      },
      {
        test: /\.svg$/,
        loader: "svg-sprite-loader"
      },
      {
        test: /\.(jpg|png|bmp|jpe?g|gif|ico)$/,
        loader: "url-loader",
        options: {
          limit: 8192,
          outputPath: "./asset/images",
          name: "[name].[hash].[ext]",
          publicPath: "/asset/images"
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
        loader: "url-loader",
        options: {
          limit: 8192,
          outputPath: "./asset/media",
          name: "[name].[hash].[ext]",
          publicPath: "/asset/media"
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        loader: "url-loader",
        options: {
          limit: 8192,
          outputPath: "./asset/fonts",
          name: "[name].[hash].[ext]",
          publicPath: "/asset/fonts"
        }
      }
    ]
  },
  plugins: [
    ...getHtmlConfig(),
    new MiniCssExtractPlugin({
      filename: "[name]/index.bundle.[hash].css",
      chunkFilename: "[id].css"
    })
  ]
};

/**
 * 批量获取 entry 值
 */
function getEntry() {
  const entries = {};
  dirNames.map((dirName) => {
    entries[dirName] = `./src/pages/${dirName}/index.tsx`;
  });
  return entries;
}

/**
 * 批量获取 new HtmlWebpackPlugin()
 */
function getHtmlConfig() {
  return dirNames.map((dirName) => {
    return new HtmlWebpackPlugin({
      filename: `${dirName}/index.html`,
      template: `./src/pages/${dirName}/index.html`,
      favicon: "./src/assets/images/react.ico",
      chunks: [dirName]
    });
  });
}
