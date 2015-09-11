'use strict';

var webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    path = require('path'),
    srcPath = path.join(__dirname, 'src');

console.log('process.env.NODE_ENV = _' + process.env.NODE_ENV + '_');


var _plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  }),
  new webpack.optimize.CommonsChunkPlugin('common', 'common-[hash:8].js'),
  new HtmlWebpackPlugin({
    inject: true,
    template: 'src/index.html'
  }),
  new webpack.NoErrorsPlugin(),
  new ExtractTextPlugin('styles-[hash:8].css'),  // // extract inline css into separate 'styles.css'
];


if (process.env.NODE_ENV == 'production') {
  _plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      preserveComments: false,
      compress: {
        sequences: true,
        dead_code: true,
        conditionals: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        drop_console: true
      }
    })
  );
}



module.exports = {
    target: 'web',
    cache: true,
    entry: {
        module: ["assets/less/main.less", "font-awesome/less/font-awesome.less", path.join(srcPath, 'module.js')],
        common: ['react', 'react-router', 'alt', 'axios', 'events', 'material-ui', 'react-bootstrap', 'react-mixin', 'react-router-bootstrap', 'react-tap-event-plugin', 'when']
    },
    resolve: {
        root: srcPath,
        extensions: ['', '.js'],
        modulesDirectories: ['node_modules', 'src']
    },
    output: {
        path: path.join(__dirname, 'build'),
        publicPath: '/',
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


    plugins: _plugins,



    debug: true,
    devtool: 'eval-source-map',
    devServer: {
        contentBase: './build',
        historyApiFallback: true,
        port: 3000,
        proxy: {
          '/api/*': 'http://localhost:8080/'
        }
    }
};




