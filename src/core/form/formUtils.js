import React from 'react';

import {walk} from 'core/common/utils/jsonUtils';
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


/**
 * Existuje-li grid gridLocation v dataObject.$grids vrati ho, jinak naklonuje grid z reduxove grid.grids mapy a vrati ho
 * @param reduxState
 * @param dataObject
 * @param gridLocation
 * @returns {*}
 */
export function selectGrid(reduxState, dataObject, gridLocation) {
  return (dataObject.$grids[gridLocation]) ? dataObject.$grids[gridLocation] : Grid.clone(reduxState.getIn(['grid', 'grids', gridLocation]));
}

/**
 * vezme grid jako payload action, naklonuje ho a ulozi do parentObject.$grids
 * parentObject potom vrati jako novy objekt (Object.assign())
 * @param parentObject
 * @param action
 * @returns {*}
 */
export function updateChildGrid(parentObject, action) {
  console.log('action %s : %O', action.type, action.payload);
  if (!parentObject.$grids) parentObject.$grids = {};
  parentObject.$grids[action.payload.gridLocation] = Grid.clone(action.payload);
  return Object.assign({},parentObject);
}


export function preSave(rootObject,  customValidate) {
  // najdu otevrene form objekty
  let openTuples = [];
  walk(rootObject, 0, (object, level) => {
    if (object.$forms) {
      let tuples = Object.values(object.$forms).filter(form => form.open).map(form => ({form, object}));
      openTuples.push(...tuples);
    }
  });


  let formsWithError = [];

  for(let {form, object} of openTuples) {
    console.log('open form %O', form);
    let res = form.validateForm(object);
    if (res) {
      form.open = false;
    } else {
      formsWithError.push(form);
    }
  }

  let newErrors;
  if (customValidate) {
    newErrors = customValidate(rootObject);
    rootObject.$errors = newErrors;
  }


  return (formsWithError.length === 0 && (!newErrors || newErrors.length === 0));
}
