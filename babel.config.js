module.exports = {
  presets: ['@babel/preset-react', '@babel/preset-env', '@babel/preset-flow'],
  plugins: [
    'styled-jsx/babel',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
  ],
};
