const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"]
        }
      }
    ]
  },
  plugins: [
      new HtmlWebpackPlugin({
       title: 'Progressive Web Application',
       template: path.resolve(__dirname, 'src', 'index.html')
      }),
      // new WorkboxPlugin.GenerateSW({
      //  clientsClaim: true,
      //  skipWaiting: true,
      // }),
  ]
};