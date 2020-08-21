module.exports = {
  mode: 'development',
  entry: ['./demo/client.jsx'],
  output: {
    filename: 'bundle.js',
    path: '/',
    publicPath: '/',
  },
  devtool: 'source-map',
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
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.ico$/,
        use: 'file-loader?name=[name].[ext]',
      },
    ],
  },
  stats: {
    colors: true,
  },
};
