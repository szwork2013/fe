import {Map} from 'immutable';
import { combineReducers } from 'redux-immutablejs';

import Grid from 'core/grid/domain/grid';
import {updateGridAction, updateGridsAction} from 'core/grid/gridActions';


// [gridLocation] -> Grid
function grids(state = new Map(), action) {
  switch (action.type) {
    case updateGridAction.type:
      console.log('updateGridAction = ', action);
      return state.set(action.payload.gridLocation, Grid.clone(action.payload));
    case updateGridsAction.type:
      return state.merge(action.payload);
    default:
      return state;
  }
}



export const grid = combineReducers({
  grids
});

