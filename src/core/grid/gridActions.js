import Axios from 'core/common/config/axios-config';
import { createAction, createPromiseAction } from 'core/common/redux/actions';
import GridService from 'core/grid/service/gridService';

// payload = {gridLocation -> Grid} map
export const updateGridsAction = createAction('CORE_GRID_UPDATE_GRIDS');

// payload = grid
export const updateGridAction = createAction('CORE_GRID_UPDATE_GRID');

export const fetchDataAction = createPromiseAction('CORE_GRID_FETCH_DATA', function(dispatch, getState, types, grid) {
  grid.loading = true;
  dispatch(createAction(types.loading)(grid));


  //  this.dispatch(grid); // this dispatches the action
  return Axios.get('/core/grid/' + grid.activeGridConfig.gridId, {params: Object.assign({searchTerm: grid.searchTerm, sort: grid.sort, masterId: grid.masterId}, grid.getConditionQueryObject())})
    .then((response) => {
      grid.data = response.data;
      grid.gridWidths = GridService.computeGridWidths(grid.data, grid.activeGridConfig);
      grid.loading = false;
      return dispatch(createAction(types.success)(grid));
    }, (err) => {
      grid.loading = false;
      return dispatch(createAction(types.error)(grid));
    });

});


