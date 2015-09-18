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

/*
 * Spocita width, min-width a max-width pro sloupce gridu.
 *
 * return Array[widths, min-widths, max-widths]
 */
  computeGridWidths(gridData, gridConfig) {
    console.time("computeGridWidths");
    // maximalni hodnota, kterou muze nabyvat min-width
    var MAXIMAL_COLUMN_MIN_WIDTH_PX = 350;
    // hodnata pro max-width sloupcu
    var MAXIMAL_COLUMN_WIDTH_PX = 7000;
    // pismeno, jimz se vyplnuji divy, podle kterych se pocita min-width
    var PATTERN_LETTER = 'C';

    let matrix = [];
    matrix.push(gridConfig.$columnRefs.map( (mdField) => {
      let v = mdField.gridHeaderLabelActive;
      return (v) ? ( (typeof v == 'string') ? v.trim().length : v.toString().trim().length ) : 0;
    }));

    if (gridData) {
      for(let row of gridData.rows) {
        matrix.push(row.cells.map((cell) => {
          let v = cell.value;
          return (v) ? ( (typeof v == 'string') ? v.trim().length : v.toString().trim().length ) : 0;
        }));
      }
    }

    let absoluteLengths = _.zip(...matrix).map(col => _.max(col));

    // let absoluteMax = _.sum(absoluteLengths);

    // puvodni vypocet sirky sloupcu - podle nejdelsich textu
    // let gridWidths = absoluteLengths.map(v => Math.round(10000 * v / absoluteMax)/100 + "%");

    // vypocet min-width pro sloupce - pomoci fiktivnich DIVu
    // horni hranice pro min-width je MAXIMAL_COLUMN_MAX_WIDTH_PX
    let gridMinWidthsPX = absoluteLengths.map(v => {
      let elemDiv = document.createElement('div');
      elemDiv.style.cssText = 'position:absolute;left:0;top:0;z-index:20;';
      elemDiv.textContent = Array(v).join(PATTERN_LETTER);
      document.body.appendChild(elemDiv);
      let elemWidth = elemDiv.clientWidth;
      document.body.removeChild(elemDiv);
      return elemWidth < MAXIMAL_COLUMN_MIN_WIDTH_PX ? elemWidth : MAXIMAL_COLUMN_MIN_WIDTH_PX;
    });

    // udelame sumu minWidths
    let sumGridMinWidths = _.sum(gridMinWidthsPX);
    // spocitame width pro sloupce tak, aby odpovidaly pomerum min-width
    let gridWidthsPrct = gridMinWidthsPX.map(v => ((100*v)/sumGridMinWidths));

    // spocitame maxWidths (jen vytvorime array)
    let gridMaxWidthsPX = Array.from(new Array(gridWidthsPrct.length), () => MAXIMAL_COLUMN_WIDTH_PX);

    console.timeEnd("computeGridWidths");
    console.debug('computeGridWidths: %o', gridWidthsPrct);
    console.debug('computeGridMinWidths: %o', gridMinWidthsPX);
    console.debug('computeGridMaxWidths: %o', gridMaxWidthsPX);
    return [gridWidthsPrct, gridMinWidthsPX, gridMaxWidthsPX];
  }


}

export default new GridService();


