import {Map} from 'immutable';
import { combineReducers } from 'redux-immutablejs';

import Grid from 'core/grid/domain/grid';
import {updateGridAction, updateGridsAction, updateGridLocationAction} from 'core/grid/gridActions';


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

// gridLocation (admin)
function gridLocation(state = null, action) {
  switch (action.type) {
    case updateGridLocationAction.type:
      console.log('updateGridLocationAction = ', action);
      return Grid.clone(action.payload);
    default:
      return state;
  }
}




export const grid = combineReducers({
  grids,
  gridLocation
});

