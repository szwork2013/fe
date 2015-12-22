import {Map, Record} from 'immutable';
import { combineReducers } from 'redux-immutablejs';

import { LoginFormRecord } from 'core/security/loginForm';

import {setCurrentUserAction, redirectAfterLoginAction, setLoginFormDataAction, setLoginFormUsernameAction, setUserAction} from 'core/security/securityActions';


function currentUser(state = null, action) {
  switch (action.type) {
    case setCurrentUserAction.type:
      return (action.payload) ? Map(action.payload) : null;
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
      return state.setFieldValue('tenant', (tenants.length > 0) ? tenants[0].value : null, true)
      .setFieldLovItems('tenant', tenants);
    default:
      return state
  }
}


function userObject(state = null, action) {
  switch (action.type) {
    case setUserAction.type:
      console.log('setUserAction = ', action);
      return Object.assign({},action.payload);
    default:
      return state;
  }
}




export const security = combineReducers({
  currentUser,
  redirectAfterLogin,
  loginFormData,
  userObject
});

