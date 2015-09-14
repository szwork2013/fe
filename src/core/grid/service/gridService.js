import Axios from 'core/common/config/axios-config';
import When from 'when';
import _ from 'lodash';

import GridStore from 'core/grid/store/gridStore';
import GridActions from 'core/grid/action/gridActions';
import Grid from 'core/grid/domain/grid';

import MdEntityStore from 'core/metamodel/mdEntityStore';
import MdEntityActions from 'core/metamodel/mdEntityActions';
import MdEntity from 'core/metamodel/mdEntity';
import MdEntityService from 'core/metamodel/mdEntityService';

import Utils from 'core/common/utils/utils';

class GridService {


  /**
   * vlozi do GridStore objekty Grid pro gridLocations ktere tam dosud nebyly
   * @param jedno nebo vice gridLocation
   * @returns {*}
   */
  fetchGrids(...gridLocations) {

    // pripravime pole Promise<Grid) pro gridy ktere nejsou v GridStore
    let promises = [];
    for (let gl of gridLocations) {
      let grid = GridStore.getGrid(gl);
      if (!grid) {
        promises.push(Axios.get('/core/grid-config', {params: {gridLocation: gl}})
          .then((response) => {
            return new Grid(gl, response.data);
          }));
      }
    }

    // pokud nejaky takovy existuje
    if (promises.length > 0) {
      var gridObject = {};

      return When.all(promises).then(gridArray => {

        var unresolvedEntities = [];
        var entityObject = {};

        for(let grid of gridArray) {
          let mdEntity = MdEntityStore.getEntity(grid.entityKey);
          if (mdEntity) {
            entityObject[grid.entityKey] = mdEntity;
          } else {
            unresolvedEntities.push(grid.entityKey);
          }
          gridObject[grid.gridLocation] = grid;
        }


        if (unresolvedEntities.length > 0) {
          return MdEntityService.fetchEntities(unresolvedEntities, entityObject);
        } else {
          return When(entityObject);
        }

      })
        .then( (entityObject) => {
          for(let gridLocation in gridObject) {
            let grid = gridObject[gridLocation];
            grid.$entityRef = entityObject[grid.entityKey];

            // doplnime gridConfig.$columnRefs: MdField[]
            for(let gridConfig of grid.gridConfigs) {
              gridConfig.syncColumnRefs(grid.$entityRef);
              gridConfig.gridWidths = this.computeGridWidths(null, gridConfig);
            }

          }
          console.log("fetchGrids promise resolved: %o", gridObject);
          return GridActions.updateGrids(gridObject);
        });
    }

  }


  computeGridWidths(gridData, gridConfig) {
    console.time("computeGridWidths");

    let matrix = [];
    matrix.push(gridConfig.$columnRefs.map( (mdField) => {
      let v = mdField.gridHeaderLabelActive;
      return  (v) ? ( (typeof v == 'string') ? v.length : v.toString.length ) : 0;
    }));

    if (gridData) {
      for(let row of gridData.rows) {
        matrix.push(row.cells.map((cell) => {
          let v = cell.value;
          return  (v) ? ( (typeof v == 'string') ? v.length : v.toString.length ) : 0;
        }));
      }
    }

    let absoluteLengths = _.zip(...matrix).map(col => _.max(col));

    let absoluteMax = _.sum(absoluteLengths);
    let gridWidths = absoluteLengths.map(v => Math.round(10000 * v / absoluteMax)/100 + "%");
    console.timeEnd("computeGridWidths");
    console.debug('computeGridWidths: %o', gridWidths);
    return gridWidths;
  }


}

export default new GridService();


