import React from 'react';

import SecurityService from 'core/security/securityService';
import Grid from 'core/grid/domain/grid';


export function showForTenant(Component, ...tenantIds) {
  let currentUser = SecurityService.getCurrentUser();
  return (tenantIds.includes(currentUser.get('tenantId'))) ? Component : '';
}

export function hideForTenant(Component, ...tenantIds) {
  let currentUser = SecurityService.getCurrentUser();
  return (tenantIds.includes(currentUser.get('tenantId'))) ? '' : Component;
}



// Or with destructuring and an implicit return, simply:
export const FieldText = ({label, value, mdField}) => ((value == null) ? <span/> : (
  <span>
    {(label) ? <span className="zz-grey-text">{label}: </span> : ''}
    <span className="zz-ml-2 zz-mr-10">{ (mdField) ? mdField.formatValue(value) : value}</span>
  </span>
));



export function selectGrid(reduxState, dataObject, gridLocation) {
  return (dataObject.$grids[gridLocation]) ? dataObject.$grids[gridLocation] : Grid.clone(reduxState.getIn(['grid', 'grids', gridLocation]));
}
