import {Map, Record} from 'immutable';
import { combineReducers } from 'redux-immutablejs';
import { createAction, createPromiseAction } from 'core/common/redux/actions';

import { LoginFormRecord } from 'core/security/loginForm';

import SecurityService from 'core/security/securityService';

export const setCurrentUserAction = createAction('CORE_SECURITY_SET_CURRENT_USER');
export const redirectAfterLoginAction = createAction('CORE_SECURITY_REDIRECT_AFTER_LOGIN');
export const setLoginFormDataAction = createAction('CORE_SECURITY_SET_LOGIN_FORM_DATA');

export const setLoginFormUsernameAction = createPromiseAction('CORE_SECURITY_SET_LOGIN_FORM_USERNAME', function(dispatch, getState, types, username) {
  dispatch(createAction(types.loading)(username));

  return SecurityService.getTenants(username)
    .then(tenants => dispatch(createAction(types.success)(tenants)));
});



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

