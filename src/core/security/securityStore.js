import {Map, Record} from 'immutable';
import { combineReducers } from 'redux-immutablejs';

import { LoginFormRecord } from 'core/security/loginForm';

import {setCurrentUserAction, redirectAfterLoginAction, setLoginFormDataAction, setLoginFormUsernameAction} from 'core/security/securityActions';


function currentUser(state = null, action) {
  switch (action.type) {
    case setCurrentUserAction.type:
      return Map(action.payload);
    default:
      return state
  }
}

function redirectAfterLogin(state = null, action) {
  switch (action.type) {
    case redirectAfterLoginAction.type:
      return action.payload;
    default:
      return state;
  }
}


function loginFormData(state = new LoginFormRecord(), action) {
  switch (action.type) {
    case setLoginFormDataAction.type:
      return action.payload;
    case setLoginFormUsernameAction.loading:
      return state.setFieldValue('username', action.payload, true);
    case setLoginFormUsernameAction.success:
      let tenants = action.payload;
      return state.setFieldValue('tenantId', (tenants.length > 0) ? tenants[0].id : null, true)
      .setFieldLovItems('tenantId', tenants);
    default:
      return state
  }
}



export const security = combineReducers({
  currentUser,
  redirectAfterLogin,
  loginFormData
});
