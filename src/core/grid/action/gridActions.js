import alt from 'core/common/config/alt-config';
import Axios from 'core/common/config/axios-config';

import {createActions} from 'alt/utils/decorators';

import GridService from 'core/grid/service/gridService';

@createActions(alt) class GridActions {

  updateGrid(grid) {
    return grid;
  }

  updateGrids(grids) {
    return grids;
  }

  fetchData(grid, activeGridConfig, searchTerm) {
    grid.data = null;
    grid.gridWidths = null;
    this.dispatch(grid); // this dispatches the action
    return Axios.get('/core/grid/' + activeGridConfig.gridId, {params: {searchTerm}})
      .then((response) => {
        grid.data = response.data;
        grid.gridWidths = GridService.computeGridWidths(grid.data, activeGridConfig);
        this.dispatch(grid); // this dispatches the action
        return grid;
      });
  }

  updateEditedGridConfig(gridConfig) {
    return gridConfig;
  }


}

export default GridActions;
