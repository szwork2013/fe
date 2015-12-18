var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');
var httpProxy = require('http-proxy');
var history = require('connect-history-api-fallback');

var app = express();
var compiler = webpack(config);

const proxy = httpProxy.createProxyServer();

app.all('/api/*', (req, res) => {
  var now = Date.now();
  proxy.web(req, res, { target: 'http://localhost:8080' });
  console.log('api: ' + req.path + " .... " + (Date.now() - now) + 'ms');
});

app.use(history());

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  progress: true
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'src/index.html'));
});

app.listen(3000, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:3000');
});



