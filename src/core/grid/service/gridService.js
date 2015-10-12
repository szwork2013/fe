import Axios from 'core/common/config/axios-config';
import When from 'when';
import _ from 'lodash';

import GridStore from 'core/grid/store/gridStore';
import GridActions from 'core/grid/action/gridActions';
import Grid from 'core/grid/domain/grid';
import GridConfig from 'core/grid/domain/gridConfig';
import GridConfigCondition from 'core/grid/domain/gridConfigCondition';
import GridConfigSort from 'core/grid/domain/gridConfigSort';

import MdEntityStore from 'core/metamodel/mdEntityStore';
import MdEntityActions from 'core/metamodel/mdEntityActions';
import MdEntity from 'core/metamodel/mdEntity';
import MdEntityService from 'core/metamodel/mdEntityService';

import Utils from 'core/common/utils/utils';

class GridService {

  defaultRoutes = {
    partyCustomers: 'partyList',
    partyContacts: 'contactPersonList',
    partySalesReps: 'salesRepList'

  };


  /**
   * vlozi do GridStore objekty Grid pro gridLocations ktere tam dosud nebyly
   * @param jedno nebo vice gridLocation
   * @returns {*}
   */
  fetchGrids(...gridLocations) {
    var gridObject = {};

    // pripravime pole Promise<Grid) pro gridy ktere nejsou v GridStore
    let promises = [];
    for (let gl of gridLocations) {
      let grid = GridStore.getGrid(gl);
      if (grid) {
        gridObject[gl] = grid;
      } else {
        promises.push(Axios.get('/core/grid-config', {params: {gridLocation: gl}})
          .then((response) => {
            return new Grid(response.data);
          }));
      }
    }

    // pokud nejaky takovy existuje
    if (promises.length > 0) {
      return When.all(promises).then(gridArray => {
        var entities = [];
        for(let grid of gridArray) {
          entities.push(grid.entityName);
          gridObject[grid.gridLocation] = grid;
        }
        return MdEntityService.fetchEntities(_.uniq(entities), {});
      })
        .then( (entityObject) => {
          for(let gridLocation in gridObject) {
            let grid = gridObject[gridLocation];
            grid.$entityRef = entityObject[grid.entityName];

            // doplnime gridConfig.$columnRefs: MdField[]

            for(let gridConfig of grid.gridConfigs) {
              GridConfig.clasifyJson(gridConfig, grid);
            }
          }
          console.log("fetchGrids promise resolved: %o", gridObject);
          return GridActions.updateGrids(gridObject);
        });
    } else {
      return When(gridObject);
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
    var MAXIMAL_COLUMN_MIN_WIDTH_PX = gridConfig.maxColumnWidth;
    // hodnata pro max-width sloupcu
    var MAXIMAL_COLUMN_WIDTH_PX = 7000;
    // retezec, ktery se doplni z text headeru pro vypocet sirky (zastupuje symobl razeni a filtru)
    var HEADER_ADDITIONAL_STRING = 'AA';
    // sirka pripocitavana ke spocitane sirce sloupce (aby text nebyl od uplneho kraje k uplnemu kraji)
    var CELL_PADDING_PX = 5;

    let matrix = [];
    let headers = gridConfig.$columnRefs.map( (mdField) => {
      let v = mdField.gridHeaderLabelActive;
      return ((v) ? ( (typeof v == 'string') ? v.trim() : v.toString().trim() ) : "") + HEADER_ADDITIONAL_STRING;
    });

    matrix.push.apply(matrix, headers);
    console.log("Array: %o", matrix);

    if (gridData) {
      for(let row of gridData.rows) {
        for (let i = 0; i < row.cells.length; i++) {
          let str = (row.cells[i].value) ? ( (typeof row.cells[i].value == 'string') ? row.cells[i].value.trim() : row.cells[i].value.toString().trim() ) : "";
          if (matrix[i].length < str.length) {
            matrix[i] = str;
          }
        }
      }
    }

    console.log("Array: %o", matrix);

    //let absoluteLengths = _.zip(...matrix).map(col => _.max(col));

    // let absoluteMax = _.sum(absoluteLengths);

    // puvodni vypocet sirky sloupcu - podle nejdelsich textu
    // let gridWidths = absoluteLengths.map(v => Math.round(10000 * v / absoluteMax)/100 + "%");

    // vypocet min-width pro sloupce - pomoci fiktivnich DIVu
    // horni hranice pro min-width je MAXIMAL_COLUMN_MAX_WIDTH_PX
    let gridMinWidthsPX = matrix.map(v => {
      let elemDiv = document.createElement('div');
      elemDiv.style.cssText = 'font-family:\'Roboto\',\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:12px;position:absolute;left:0px;top:0px;z-index:0;visibility:hidden;';
      elemDiv.textContent = v;
      document.body.appendChild(elemDiv);
      let elemWidth = elemDiv.clientWidth + CELL_PADDING_PX;
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



  validateCondition(condition, errorMessages, index, allOperators) {
    if (!condition.column || !condition.operator) {
      errorMessages.push( (index+1) + ". výběrový filtr musí mít vyplněn sloupec a operátor");
      return false;
    }
    let operatorLov = allOperators.find(li => li.value === condition.operator);
    let cardinality = operatorLov.params[0];
    if (cardinality == 1 || cardinality == "N") {
      if (_.isEmpty(condition.values) || !condition.values[0]) {
        errorMessages.push( (index+1) + ". výběrový filtr musí mít vyplněnou hodnotu");
        return false;
      }
    }  else if (cardinality == 2) {
      if (_.isEmpty(condition.values) || condition.values.length < 2 || !condition.values[0] || !condition.values[1]) {
        errorMessages.push( (index+1) + ". výběrový filtr musí mít vyplněné obě hodnoty");
        return false;
      }
    }
    return true;
  }

  validateSortColumn(sortColumns, sortColumn, errorMessages, index) {
    if (!sortColumn.field || !sortColumn.sortOrder) {
      errorMessages.push( (index+1) + ". řazení v sestavě musí mít vyplněno sloupec a volbu řazení");
      return false;
    }

    if (sortColumn.fixed) {
      if (sortColumns.filter( (v,i) =>  ( !v.fixed && i < index ) ).length > 0) {
        errorMessages.push("Uzamknutá řazení musí být na začátku seznamu řazení (tj. nemůže být například první řazení odemčené a druhé zamčené.")
        return false;
      }
    }

    return true;
  }


}

export default new GridService();


