import {Map, Record} from 'immutable';
import { combineReducers } from 'redux-immutablejs';

import {setPartyAction, updateGridAction} from 'party/partyActions';
import Grid from 'core/grid/domain/grid';
import {updateChildGrid} from 'core/form/formUtils';

function partyObject(state = null, action) {
  switch (action.type) {
    case setPartyAction.type:
      console.log('setPartyAction = ', action);
      return Object.assign({},action.payload);
    case updateGridAction.type:
      return updateChildGrid(state, action);
    default:
      return state;
  }
}





export const party = combineReducers({
  partyObject
});

