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
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
      // Lets you write ?debug_session=<name> in address bar to persist debug sessions
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(createStore);
  } else {
    _finalCreateStore = applyMiddleware(thunkMiddleware)(createStore);
  }

  return _finalCreateStore(reducer);
}
