import Axios from 'core/common/config/axios-config';
import When from 'when';

import GridStore from 'core/grid/store/gridStore';
import GridActions from 'core/grid/action/gridActions';
import Grid from 'core/grid/domain/grid';

import MdEntityStore from 'core/metamodel/mdEntityStore';
import MdEntityActions from 'core/metamodel/mdEntityActions';

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
        promises.push(Axios.get('/core/grid-config', {params: {gridLocation: gl}})
          .then((response) => {
            return new Grid(gl, response.data);
          }));
      }
    }
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
          return Axios.get('/core/metamodel/entity', {params: {entityKey: unresolvedEntities}})
            .then((response) => {
              if (response.data.length  > 0) {
                for(let entity of response.data) {
                  entityObject[entity.id] = entity;
                }
                MdEntityActions.updateEntities(entityObject);
              }
              return entityObject;
            });

        } else {
          return When(entityObject);
        }

      })
        .then( (entityObject) => {
          for(let gridLocation in gridObject) {
            let grid = gridObject[gridLocation];
            grid.$entityRef = entityObject[grid.entityKey];
          }
          console.log("fetchGrids promise resolved: %o", gridObject);
          return GridActions.updateGrids(gridObject);
        });
    }

  }


}

export default new GridService();


