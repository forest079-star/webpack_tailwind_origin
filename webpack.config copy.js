const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");   
const path = require('path');

module.exports = {
  target: 'web',
  // 入口
  entry: './src/index.js',
  // 模式 development
  mode: 'development',
  // 出口
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.[hash].js',
  },
  // loader
  module: {
    rules: [{
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            }
          },
          {
            loader: 'postcss-loader'
          }
        ],
      },
      {
        test: /\.gif/,
        type: 'asset/resource'
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        }
      }
    ],
  },
  // 插件
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'index.[hash].css'
    }),
    new CleanWebpackPlugin(),
    new CompressionPlugin()
  ],
  devServer: {
    // https://webpack.js.org/configuration/dev-server/#devserverhistoryapifallback
    // HTML5 History API
    historyApiFallback: true, // Vue Router 會用到的功能
    port: 3300,
    hot: true, // 支援 css hot reload
    // watchContentBase: true,
    before(app, server) {
      const chokidar = require('chokidar');
      // hot reload for html, pug 監聽HTML檔案有更新就 reload
      chokidar.watch('src/**/*').on('all', () => {
        server.sockWrite(server.sockets, 'content-changed');
      });
    },
  },

  devtool: 'source-map'
}