var webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    history = require('connect-history-api-fallback'),
    path = require('path'),
    srcPath = path.join(__dirname, 'src');

module.exports = {
    target: 'web',
    cache: true,
    entry:  ['assets/less/main.less', 'font-awesome/less/font-awesome.less', 'babel-polyfill', 'webpack-hot-middleware/client', path.join(srcPath, 'module.js')],
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
    },


    plugins: [
      new webpack.ProgressPlugin(defaultHandler),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('development')
        },
        __DEV__: true,
        __REDUXDEVTOOLS__: (process.argv.indexOf("--devtools") != -1)
      }),

      new HtmlWebpackPlugin({
        inject: true,
        template: 'src/index.html'
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new ExtractTextPlugin('styles-[hash:8].css'),  // // extract inline css into separate 'styles.css'
      new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/])
    ],

    debug: true,
    devtool: 'cheap-module-eval-source-map',

    stats: {
    		colors: true
		}

};


/*
 tohle je defaultHandler, ProgressPlugin, ktery jeste neni releasnuty, pridava moznost defaultHandler
 po vydano nove verze webpacku bude mozne volat new webpack.ProgressPlugin() a tento handler odstranit
 */


var chars = 0,
  lastState, lastStateTime;

function defaultHandler(percentage, msg) {
  var state = msg;

  function goToLineStart(nextMessage) {
    var str = "";
    for(; chars > nextMessage.length; chars--) {
      str += "\b \b";
    }
    chars = nextMessage.length;
    for(var i = 0; i < chars; i++) {
      str += "\b";
    }
    if(str) process.stderr.write(str);
  }

  if(percentage < 1) {
    percentage = Math.floor(percentage * 100);
    msg = percentage + "% " + msg;
    if(percentage < 100) {
      msg = " " + msg;
    }
    if(percentage < 10) {
      msg = " " + msg;
    }
  }
  state = state.replace(/^\d+\/\d+\s+/, "");
  if(percentage === 0) {
    lastState = null;
    lastStateTime = +new Date();
  } else if(state !== lastState || percentage === 1) {
    var now = +new Date();
    if(lastState) {
      var stateMsg = (now - lastStateTime) + "ms " + lastState;
      goToLineStart(stateMsg);
      process.stderr.write(stateMsg + "\n");
      chars = 0;
    }
    lastState = state;
    lastStateTime = now;
  }
  goToLineStart(msg);
  process.stderr.write(msg);
}
