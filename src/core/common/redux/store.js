import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

import reducer from 'core/common/redux/reducer';


export const store = finalCreateStore();

function finalCreateStore() {

  console.debug('Creating redux store __REDUXDEVTOOLS__ = ' + __REDUXDEVTOOLS__);

  let _finalCreateStore;

  if (__REDUXDEVTOOLS__) {
    const { persistState } = require('redux-devtools');
    const DevTools = require('core/common/redux/devtools');

    _finalCreateStore = compose(
      // Enables your middleware: any Redux middleware, e.g. redux-thunk
      applyMiddleware(thunkMiddleware),
      // Provides support for DevTools:
      DevTools.instrument(),
      // Lets you write ?debug_session=<name> in address bar to persist debug sessions
      persistState(getDebugSessionKey())
    )(createStore);

    var _store = _finalCreateStore(reducer);

    // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
    if (module.hot) {
      module.hot.accept('core/common/redux/reducer', () =>
        _store.replaceReducer(require('core/common/redux/reducer')/*.default if you use Babel 6+ */)
      );
    }
    return _store;
  } else {
    _finalCreateStore = applyMiddleware(thunkMiddleware)(createStore);
    return _finalCreateStore(reducer);
  }


}

function getDebugSessionKey() {
  // You can write custom logic here!
  // By default we try to read the key from ?debug_session=<key> in the address bar
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
  return (matches && matches.length > 0)? matches[1] : null;
}

