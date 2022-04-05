const path = require('path');
const webpack = require('webpack');
const ENV = process.env['NODE_ENV'];
const mode = ENV || 'development';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MinifyWebpackPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const childProces = require('child_process');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
module.exports = {
  mode,
  entry: {
    main: './src/app.js',
  },
  devtool: ENV === 'development' ? 'inline-source-map' : 'cheap-source-map',
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js'],
  },
  stats: 'errors-only',
  devServer: {
    hot: true,
    client: {
      overlay: true,
    },
    port: 8081,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ENV === 'development' ? 'style-loader' : MinifyWebpackPlugin.loader, 'css-loader'],
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: '/node_modules/',
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: './assets', to: './images', noErrorOnMissing: true }],
    }),
    new webpack.BannerPlugin({
      banner: `
      Build date: ${new Date().toLocaleString()}
      Commit Version: ${childProces.execSync('git rev-parse --short HEAD')}
      Author: ${childProces.execSync('git config user.name')}
      email: ${childProces.execSync('git config user.email')}
      `,
    }),
    ...(ENV === 'development' ? [] : [new MinifyWebpackPlugin({ filename: '[name].css' })]),
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({}),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      templateParameters: {
        env: ENV === 'development' ? '(개발용)' : '',
      },
      minify:
        process.env.NODE_ENV === 'production'
          ? {
              collapseWhitespace: true,
              removeComments: true,
            }
          : false,
    }),
  ],
  optimization: {
    minimizer:
      ENV === 'development'
        ? []
        : [
            new CssMinimizerPlugin(),
            new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: true,
                },
              },
            }),
          ],
  },
};
