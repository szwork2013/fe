import { combineReducers } from 'redux-immutablejs';

import {core} from 'core/coreReducer';


const zauzooApp = combineReducers({
  core
});

export default zauzooApp;
