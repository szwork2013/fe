
console.log('__DEV__ = ' + __DEV__);

if (__DEV__) {
  var Immutable = require("immutable");
  var installDevTools = require("immutable-devtools");
  installDevTools(Immutable);
}

