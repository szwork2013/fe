import alt from 'core/common/config/alt-config';
import {createStore, bind} from 'alt/utils/decorators';


import Grid from 'core/grid/domain/grid';
import actions from 'core/grid/action/gridActions';

@createStore(alt)
class GridStore {

  constructor() {

    // [gridLocation] -> Grid
    this.state = {
    };

  }

  /**
   * Vrati Grid objekt pro danou gridLocation
   * @param entityKey
   * @param route - nepovinny parametr
   * @returns {*}
     */
  static getGrid(gridLocation) {
    return this.getState()[gridLocation];
  }



  @bind(actions.updateGrid)
  updateGrid(grid) {
    console.debug("updateGrid: ", grid);
    this.setState({ [grid.gridLocation] : grid });
  }

  @bind(actions.updateGrids)
  updateGrids(grids) {
    console.debug("updateGrids: ", grids);
    this.setState(grids);
  }

  @bind(actions.fetchData)
  fetchData(grid) {
    console.debug("storing grid with fetchData: ", grid);
    this.setState({ [grid.gridLocation] : grid });
  }

}

export default GridStore;
