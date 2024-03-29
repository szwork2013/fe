import { createAction } from 'core/common/redux/actions';


// payload = {gridLocation -> Grid} map
export const updateGridsAction = createAction('CORE_GRID_UPDATE_GRIDS');

// payload = grid
export const updateGridAction = createAction('CORE_GRID_UPDATE_GRID');

// payload = grid
export const updateGridObjectAction = createAction('CORE_GRID_UPDATE_GRID_OBJECT');

// payload = grid
export const updateGridObjectGridAction = createAction('CORE_GRID_UPDATE_GRID_OBJECT_GRID');
