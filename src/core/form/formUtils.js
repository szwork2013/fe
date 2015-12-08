import SecurityService from 'core/security/securityService';
import {includes} from 'lodash'


export function showForTenant(Component, ...tenantIds) {
  let currentUser = SecurityService.getCurrentUser();
  return (includes(tenantIds, currentUser.get('tenantId'))) ? Component : '';
}

export function hideForTenant(Component, ...tenantIds) {
  let currentUser = SecurityService.getCurrentUser();
  return (includes(tenantIds, currentUser.get('tenantId'))) ? '' : Component;
}



