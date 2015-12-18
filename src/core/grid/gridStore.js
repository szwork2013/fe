import {Map} from 'immutable';
import { combineReducers } from 'redux-immutablejs';

import Grid from 'core/grid/domain/grid';
import {updateGridAction, updateGridsAction, fetchDataAction} from 'core/grid/gridActions';


// [gridLocation] -> Grid
function grids(state = new Map(), action) {
  switch (action.type) {
    case updateGridAction.type:
      return state.set(action.payload.gridLocation, Grid.clone(action.payload));
    case updateGridsAction.type:
      return state.merge(action.payload);
    case fetchDataAction.loading:
    case fetchDataAction.success:
    case fetchDataAction.error:
      return state.set(action.payload.gridLocation, Grid.clone(action.payload));
    default:
      return state;
  }
}



export const grid = combineReducers({
  grids
});

