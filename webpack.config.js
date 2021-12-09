const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");   
const path = require('path');

const DEV_MODE = process.env.NODE_ENV === 'development';
console.log(`DEV_MODE:${DEV_MODE}`);

const CONTENT_HASH = DEV_MODE ? '' : '-[contenthash]';

module.exports = {
  context: path.resolve('src'), //context 指定所有的檔案都從 src 資料始開始
  target: 'web',
  // 入口
  // entry: './index.js',
  entry: { // 程式進入點
    app: ['./index.js'], // 因為有加 context, 所以就不用寫 src
  },
  // 模式 development
  mode: process.env.NODE_ENV,
  // 出口
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.[hash].js',
  },
  resolve: {
    modules: [
      // 在 import 檔案, 如果不想寫完整的路徑
      // 可以加入這些目錄, 讓 webpack 自動尋找, 主要是讓圖片支援 ~img 路徑寫法
      path.resolve('src'),
      path.resolve('node_modules'),
    ],
    // 改為絕對路徑模式去找檔案
    alias: {
      '@': path.resolve('src'),
    },
  },
  // loader
  module: {
    rules: [{
        // test: /\.(s[ac]|c)ss$/i,
        // test: /\.css$/i,
        test: /\.(css|scss)$/,
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
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              // 可以注入全域變數
              // additionalData: `  
              //   $DEV_MODE: ${DEV_MODE};
              //   @import '~css/mixins/_mixin.scss';
              // `,
            },
          },
        ],
      },
      {
        // test: /\.gif/,
        test: /\.(png|jpg|gif|svg|ico)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 2048, // 小於 2048 bytes(2k) 的圖檔, 自動變成 base64 字串
              // 檔名： [資料夾][檔名].[副檔名]
              name: '[path][name].[ext]?[hash:10]',
              esModule: false,
            },
          },
        ],
        include: path.resolve('src/img'),
        type: 'asset/resource'
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
        include: [path.resolve('src')], // 只找這個資料夾下的檔案，可以加速 webpack 打包
        exclude: /node_modules/, // 排除文件，加速 webpack 打包
      }
    ],
  },
  // 插件
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
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
    stats: 'minimal',
    // watchContentBase: true,
    before(app, server) {
      const chokidar = require('chokidar');
      // hot reload for html, pug 監聽HTML檔案有更新就 reload
      chokidar.watch('src/**/*').on('all', () => {
        server.sockWrite(server.sockets, 'content-changed');
      });
    },
  },

   devtool: DEV_MODE ? 'source-map' : false,
}