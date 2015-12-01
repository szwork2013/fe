import { combineReducers } from 'redux-immutablejs';

import {security} from 'core/security/securityReducer'



export const core = combineReducers({
  security
});




