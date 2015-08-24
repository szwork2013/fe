import alt from 'core/common/config/alt-config';
import {createActions} from 'alt/utils/decorators';

@createActions(alt)
class GridActions {

  updateGrid(grid) {
    return grid;
  }

  updateGrids(grids) {
    return grids;
  }
}

export default GridActions;
