var path = require('path');
var srcPath = path.join(__dirname, '../src');
require('app-module-path').addPath(srcPath);

console.log("Added modules path: " + srcPath);


import jsdom from 'jsdom';
import chai from 'chai';
import chaiImmutable from 'chai-immutable';



const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
const win = doc.defaultView;

global.document = doc;
global.window = win;
global.__DEV__ = true;

Object.keys(window).forEach((key) => {
  if (!(key in global)) {
    global[key] = window[key];
  }
});

chai.use(chaiImmutable);

console.debug = function(args)  {
    console.log(args);
};
