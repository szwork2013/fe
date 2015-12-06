import { combineReducers } from 'redux-immutablejs';

import {security} from 'core/security/securityStore';
import {metamodel} from 'core/metamodel/metamodelStore';


export const core = combineReducers({
  metamodel,
  security
});




