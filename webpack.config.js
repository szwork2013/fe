'use strict';

var webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    path = require('path'),
    srcPath = path.join(__dirname, 'src');


module.exports = {
    target: 'web',
    cache: true,
    entry: {
        module: ["assets/less/bootstrap-custom.less", "font-awesome/less/font-awesome.less", path.join(srcPath, 'module.js')],
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
        filename: '[name]-[hash:8].js',
        library: ['Zauzoo', '[name]'],
        pathInfo: true
    },

    module: {
        loaders: [
            {test: /\.js?$/, include: srcPath, loaders: ['react-hot', 'babel?cacheDirectory']},

            {test: /\.less$/, loader: ExtractTextPlugin.extract('css?sourceMap!less?sourceMap')},

            //{test: /\.less$/, loader: ExtractTextPlugin.extract('css?sourceMap!less?sourceMap')},

            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
        ]
    },


    plugins: [
        new webpack.optimize.CommonsChunkPlugin('common', 'common-[hash:8].js'),
        new HtmlWebpackPlugin({
            inject: true,
            template: 'src/index.html'
        }),
        new webpack.NoErrorsPlugin(),
        new ExtractTextPlugin('styles-[hash:8].css')  // // extract inline css into separate 'styles.css'
    ],

    debug: true,
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: './build',
        historyApiFallback: true,
        port: 3000,
        proxy: {
          '/api/*': 'localhost:8080/api/'
        }
    }
};
