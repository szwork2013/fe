import Axios from 'core/common/config/axios-config';
import When from 'when';

import commonService from 'core/common/service/commonService';
import GridStore from 'core/grid/store/gridStore';
import GridActions from 'core/grid/action/gridActions';
import Grid from 'core/grid/domain/grid';

class GridService {


  /**
   * vlozi do GridStore objekty Grid pro gridLocations ktere tam dosud nebyly
   * @param jedno nebo vice gridLocation
   * @returns {*}
   */
  fetchGrids(...gridLocations) {

    let promises = [];
    for (let gl of gridLocations) {
      let grid = GridStore.getGrid(gl);
      if (!grid) {
        promises.push(Axios.get( commonService.api('/core/grid-config'), {params: {gridLocation: gl}})
          .then((response) => {
            return new Grid(gl, response.data);
          }));
      }
    }
    if (promises.length > 0) {
      return When.all(promises).then(gridArray => {
        let gridObject = gridArray.reduce((acc, grid) => {
          acc[grid.gridLocation] = grid;
          return acc;
        }, {});
        console.log("fetchGrids promise resolved: %o", gridObject);
        return GridActions.updateGrids(gridObject);
      });
    }

  }


}

export default new GridService();

