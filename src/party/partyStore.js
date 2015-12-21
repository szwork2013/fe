import {Map, Record} from 'immutable';
import { combineReducers } from 'redux-immutablejs';

import {setPartyAction, updateGridAction} from 'party/partyActions';
import Grid from 'core/grid/domain/grid';


function partyObject(state = null, action) {
  switch (action.type) {
    case setPartyAction.type:
      console.log('setPartyAction = ', action);
      return Object.assign({},action.payload);
    case updateGridAction.type:
      console.log('updateGridAction %s : %O', action.type, action.payload);
      state.$grids[action.payload.gridLocation] = Grid.clone(action.payload);
      return Object.assign({},state);
    default:
      return state;
  }
}





export const party = combineReducers({
  partyObject
});

