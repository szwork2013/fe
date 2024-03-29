import {Map} from 'immutable';
import { combineReducers } from 'redux-immutablejs';

import Grid from 'core/grid/domain/grid';
import {updateGridAction, updateGridsAction, updateGridObjectAction, updateGridObjectGridAction} from 'core/grid/gridActions';
import {updateChildGrid} from 'core/form/formUtils';

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
function gridObject(state = null, action) {
  switch (action.type) {
    case updateGridObjectAction.type:
      console.log('updateGridObjectAction = %O', action.payload);
      return Grid.clone(action.payload);
    case updateGridObjectGridAction.type:
      return updateChildGrid(state, action);
    default:
      return state;
  }
}




export const grid = combineReducers({
  grids,
  gridObject
});

