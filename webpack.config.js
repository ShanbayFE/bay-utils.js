const webpack = require('webpack');
const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');

const buildPath = path.join(__dirname, 'dist/');

const commonConfig = {
    entry: {
        'bay-utils': ["babel-polyfill", './src/index'],
        'bay-utils.min': ["babel-polyfill", './src/index'],
    },
    output: {
        path: buildPath,
        filename: '[name].js',
        library: 'bayUtils',
        libraryTarget: 'var',
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loaders: ['babel'],
        }],
    },
    plugins: [
        new CleanWebpackPlugin(['./dist']),
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true,
            compress: {
                warnings: false
            }
        }),
    ],
};

module.exports = commonConfig;
