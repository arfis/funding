const { alias } = require('react-app-rewire-alias');

module.exports = function override(config) {
    alias({
        '@': 'src',
    })(config);

    config.resolve.fallback = {
        "os": require.resolve("os-browserify/browser"),
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert"),
        "https": require.resolve("https-browserify"),
        "http": require.resolve("stream-http"),
        "zlib": require.resolve("browserify-zlib"),
        "buffer": require.resolve("buffer"),
        "util": require.resolve("util")
    };

    return config;
};
