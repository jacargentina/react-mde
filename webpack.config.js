const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: ['./src/index.js'],
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.js(x?)/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.ico$/,
        use: 'file-loader?name=[name].[ext]'
      },
      {
        test: /\.eot|\.ttf|\.svg|\.woff2?/,
        use: 'file-loader?name=[name].[ext]'
      }
    ]
  },
  stats: {
    colors: true
  }
};
