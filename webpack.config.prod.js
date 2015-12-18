var webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  path = require('path'),
  srcPath = path.join(__dirname, 'src');

console.log('process.env.NODE_ENV : ' + process.env.NODE_ENV);

module.exports = {
  target: 'web',
  cache: true,

  devtool: 'source-map',

  entry : {
    module: ["assets/less/main.less", "font-awesome/less/font-awesome.less", 'babel-polyfill', path.join(srcPath, 'module.js')],
    common: ["axios", "classnames", "events", "material-ui", "moment", "numeral", "react",
      "react-addons-linked-state-mixin", "react-bootstrap", "react-dom", "react-mixin", "react-router", "react-select", "react-tap-event-plugin", "react-toastr", "react-widgets", "when"]
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

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),

    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      },
      __DEV__: false,
      __REDUXDEVTOOLS__: false
    }),

    new webpack.optimize.CommonsChunkPlugin('common', 'common-[hash:8].js'),

    new HtmlWebpackPlugin({
      inject: true,
      template: 'src/index.html'
    }),

    new webpack.NoErrorsPlugin(),

    new ExtractTextPlugin('styles-[hash:8].css'),  // // extract inline css into separate 'styles.css'

    new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),

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

  ],
  module: {
    loaders: [
      {
        test: /\.js?$/,
        include: srcPath,
        loaders: ['babel']
      },

      {test: /\.less$/, loader: ExtractTextPlugin.extract('css?sourceMap!less?sourceMap')},

      //{test: /\.less$/, loader: ExtractTextPlugin.extract('css?sourceMap!less?sourceMap')},

      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ]
    //   noParse: [/moment.js/]  - zmensi build, protoze bez toho se bundluji vsechny locales, ale s tim zase nefunguje react-widgets/lib/localizers/moment


  }
};
