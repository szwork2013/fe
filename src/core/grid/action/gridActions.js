import alt from 'core/common/config/alt-config';
import Axios from 'core/common/config/axios-config';

import {createActions} from 'alt/utils/decorators';

@createActions(alt) class GridActions {

  updateGrid(grid) {
    return grid;
  }

  updateGrids(grids) {
    return grids;
  }

  fetchData(grid, activeGridConfig, searchTerm) {
    return Axios.get('/core/grid/' + activeGridConfig.gridId, {params: {searchTerm}})
      .then((response) => {
        grid.data = response.data;
        return grid;
      });
  }


}

export default GridActions;
