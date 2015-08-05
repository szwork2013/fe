'use strict';

var webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    path = require('path'),
    srcPath = path.join(__dirname, 'src');

module.exports = {
    target: 'web',
    cache: true,
    entry: {
        module: path.join(srcPath, 'module.js'),
        common: ['react', 'react-router', 'alt']
    },
    resolve: {
        root: srcPath,
        extensions: ['', '.js'],
        modulesDirectories: ['node_modules', 'src']
    },
    output: {
        path: path.join(__dirname, 'build'),
        publicPath: '',
        filename: '[name]-[hash].js',
        library: ['Zauzoo', '[name]'],
        pathInfo: true
    },

    module: {
        loaders: [
            {test: /\.js?$/, include: srcPath, loaders: ['react-hot', 'babel?cacheDirectory']}
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('common', 'common-[hash].js'),
        new HtmlWebpackPlugin({
            inject: true,
            template: 'src/index.html'
        }),
        new webpack.NoErrorsPlugin(),
        //new webpack.optimize.UglifyJsPlugin({
        //  compress: {
        //    warnings: false
        //  }
        //})
    ],

    debug: true,
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        contentBase: './build',
        historyApiFallback: true,
        port: 3000,
        proxy: {
          '/api/*': 'localhost:8080/api/'
        }
    }
};
