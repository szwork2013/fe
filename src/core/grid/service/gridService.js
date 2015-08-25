import Axios from 'core/common/config/axios-config';
import When from 'when';

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
              gridConfig.$columnRefs = [];
              for(let fieldKey of gridConfig.columns) {
                let fk = Utils.parseId(fieldKey);
                let mdField = grid.$entityRef.getField(fk[2]);
                gridConfig.$columnRefs.push(mdField);
              }
            }

          }
          console.log("fetchGrids promise resolved: %o", gridObject);
          return GridActions.updateGrids(gridObject);
        });
    }

  }


}

export default new GridService();


