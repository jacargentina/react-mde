const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: ['./demo/client.jsx'],
  output: {
    filename: 'bundle.js',
    path: '/',
    publicPath: '/'
  },
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
      { test: /\.css/, use: ['style-loader', 'css-loader'] },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: { sourceMap: true }
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }
        ]
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
