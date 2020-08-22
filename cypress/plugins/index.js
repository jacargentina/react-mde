const wp = require('@cypress/webpack-preprocessor');

const webpackOptions = require('../webpack.config.js');

module.exports = (on) => {
  on(
    'file:preprocessor',
    wp({
      webpackOptions,
    })
  );
};
