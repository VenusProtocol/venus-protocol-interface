const webpack = require('webpack');

module.exports = function override(config) {
  const conf = config;
  conf.resolve.fallback = {
    url: require.resolve('url'),
    util: require.resolve('util'),
    // fs: require.resolve('fs'),
    path: require.resolve('path-browserify'),
    assert: require.resolve('assert'),
    crypto: require.resolve('crypto-browserify'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify/browser'),
    buffer: require.resolve('buffer'),
    stream: require.resolve('stream-browserify'),
  };

  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    })
  );
  return conf;
};
