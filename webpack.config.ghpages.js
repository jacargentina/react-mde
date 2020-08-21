const path = require('path');

module.exports = {
  mode: 'production',
  entry: ['./demo/client.jsx'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'docs'),
    publicPath: '/react-mde',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  stats: {
    colors: true,
  },
};
