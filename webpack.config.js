'use strict';

const path = require('path');
const webpack = require('webpack');

const ASSET_PATH = path.resolve(__dirname, 'resources');

/**@type {import('webpack').Configuration}*/
const config = {
  target: 'node', // vscode extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/

  entry: './src/extension.ts', // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
  output: {
    // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
    path: path.resolve(__dirname, 'out'),
    publicPath: path.resolve(__dirname, 'resources'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]',
  },
  devtool: 'source-map',
  externals: [
    {
      vscode: 'commonjs vscode', // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/,
    },
    function (context, request, callback) {
      if (/@babel\/parser/.test(request)) {
        return callback(null, path.resolve(ASSET_PATH, request));
      }
      callback();
    },
  ],
  resolve: {
    // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
    extensions: ['.ts', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: /bin/,
        use: [
          {
            loader: 'shebang-loader',
          },
        ],
      },
      {
        test: /\.ts$/,
        exclude: /node_modules|\.vscode-test/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __ASSET_PATH__: JSON.stringify(ASSET_PATH),
    }),
  ],
};
module.exports = config;
