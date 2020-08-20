const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: ['./demo/client.jsx'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'ghpages'),
    publicPath: '/react-mde'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.js(x?)/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },

  stats: {
    colors: true
  }
};
