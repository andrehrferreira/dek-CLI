module.exports = (self) => {
    return `
const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: path.resolve('public/src/main.js'),
    output: {
        path: path.resolve('public/build'),
        publicPath: "public/build",
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\\\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};`;
}
