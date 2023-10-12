module.exports = function override(config, env) {
    config.module.rules.push({
        test: /\.txt$/i,
        use: "raw-loader",
    });
    return config;
};
