import { combineReducers } from 'redux-immutablejs';

import {security} from 'core/security/securityStore';
import {metamodel} from 'core/metamodel/metamodelStore';
import {party} from 'party/partyStore';

const zauzooApp = combineReducers({
  metamodel,
  security,
  party
});

export default zauzooApp;
