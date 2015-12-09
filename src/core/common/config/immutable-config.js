
console.log('__DEV__ = ' + __DEV__);

/**
 * toto je plugin do chrome devtools pro hezke zobrazeni immutablejs struktur
 * funguje od CH 48, nema to nic spolecneho s redux-devtools
 */

if (__DEV__) {
  var Immutable = require("immutable");
  var installDevTools = require("immutable-devtools");
  installDevTools(Immutable);
}
