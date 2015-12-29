import { createAction, createPromiseAction } from 'core/common/redux/actions';

import SecurityService from 'core/security/securityService';

export const setCurrentUserAction = createAction('CORE_SECURITY_SET_CURRENT_USER');
export const redirectAfterLoginAction = createAction('CORE_SECURITY_REDIRECT_AFTER_LOGIN');
export const setLoginFormDataAction = createAction('CORE_SECURITY_SET_LOGIN_FORM_DATA');

export const setLoginFormUsernameAction = createPromiseAction('CORE_SECURITY_SET_LOGIN_FORM_USERNAME', function(dispatch, getState, types, username) {
  dispatch(createAction(types.loading)(username));

  return SecurityService.getTenants(username)
    .then(tenants => dispatch(createAction(types.success)(tenants)));
});


export const setUserAction = createAction('CORE_SECURITY_SET_USER');

export const updateGridAction = createAction('CORE_SECURITY_UPDATE_GRID');

