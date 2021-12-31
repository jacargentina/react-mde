module.exports = {
  testEnvironment: 'jsdom',
  "transform": {
    "^.+\\.tsx?$": "esbuild-jest",
    "^.+\\.css$": "esbuild-jest"
  },
};
