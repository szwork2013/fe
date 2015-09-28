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

  /**
   *
   * @param grid - Grid
   * @returns Promise<Grid>
   */
  fetchData(grid) {

  //  this.dispatch(grid); // this dispatches the action
    return Axios.get('/core/grid/' + grid.activeGridConfig.gridId, {params: {searchTerm: grid.searchTerm, sort: grid.sort}})
      .then((response) => {
        grid.data = response.data;
        grid.gridWidths = GridService.computeGridWidths(grid.data, grid.activeGridConfig);
        this.dispatch(grid); // this dispatches the action
        return grid;
      });
  }

}

export default GridActions;
