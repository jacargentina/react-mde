// @flow
import fs from 'fs';
import express from 'express';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpack from 'webpack';
import webpackConfig from '../webpack.config.demo';

const packageJson = require('../package.json');

const webpackCompiler = webpack(webpackConfig);
const port = 4000;

require.extensions['.html'] = (module, filename) => {
  module.exports = fs.readFileSync(filename, 'utf8');
};

const app = express();

app.use(webpackMiddleware(webpackCompiler));
app.use(webpackHotMiddleware(webpackCompiler));
app.use((req, res) => res.status(200).send(require('./index.html')));

app.listen(port, '0.0.0.0', () => {
  const demoUrl = `http://localhost:${port}/`;
  console.log(`${packageJson.name} running at ${demoUrl}`);
});
