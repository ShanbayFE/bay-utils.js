const webpack = require('webpack');
const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');

const buildPath = path.join(__dirname, 'dist/');

const plugins = [
    new CleanWebpackPlugin(['./dist']),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
        },
    }),
];

const commonLoaders = [
    {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel'],
    }
];

const commonConfig = {
    entry: {
        utils: './src/index',
    },
    output: {
        path: buildPath,
        filename: 'utils.js',
        library: 'xbayCommon',
        libraryTarget: 'var',
    },
    module: {
        loaders: commonLoaders,
    },
    plugins,
};

module.exports = commonConfig;
