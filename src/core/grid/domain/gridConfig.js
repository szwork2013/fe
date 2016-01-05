import _ from 'lodash';

import Utils from 'core/common/utils/utils';
import MdField from 'core/metamodel/mdField';
import GridConfigCondition from 'core/grid/domain/gridConfigCondition';
import GridConfigSort from 'core/grid/domain/gridConfigSort';
import GridService from 'core/grid/gridService';

export default class GridConfig {

  static clasifyJson(gridConfig, grid) {
    Object.setPrototypeOf(gridConfig, GridConfig.prototype);
    gridConfig.$gridRef = grid;

    gridConfig.syncColumnRefs(grid.$entityRef);
    gridConfig.gridWidths = GridService.computeGridWidths(null, gridConfig);

    // premapujeme na objekt
    gridConfig.conditions = gridConfig.conditions.map(gcc => Object.assign(new GridConfigCondition(gridConfig), gcc));
    gridConfig.sortColumns = gridConfig.sortColumns.map(gcc => Object.assign(new GridConfigSort(gridConfig), gcc));
  }

  constructor (grid) {

    this.$gridRef = grid;

    // list of fieldKeys
    this.columns = [];

    // array of MdField (doplneno pozdeji ve GridService#fetchGrids() )
    this.$columnRefs = [];

    // array of GridConfigCondition
    this.conditions = [];

    this.gridId = null;

    this.gridLocation = null;

    // PUBLIC vs PRIVATE vs SEARCH?
    this.gridUse = null;

    // lokalizovany nazev
    this.label = null;

    // vlastni nazev;
    this.gridName;

    // array of GridConfigSort
    this.sortColumns = [];

    // pole sirek sloupcu, pouze pro tento gridConfig, bez dat
    this.gridWidths = null;

    // priznak, zda se maji radky pod mysi obarvovat
    this.showRowHover = false;

    // priznak, ze grid config je defaultni
    this.defaultGrid;

    this.gridScrollSize;
    this.gridScrollIncrement;
    this.maxColumnWidth;

  }


  syncColumnRefs(entityRef) {
    this.$columnRefs = [];
    for(let fieldKey of this.columns) {
      let fk = Utils.parseId(fieldKey);
      let mdField = entityRef.getField(fk[1]);
      this.$columnRefs.push(mdField);
    }
  }


  clone() {
    let newGridConfig = new GridConfig(this.$gridRef);
    Object.assign(newGridConfig, this);
    newGridConfig.conditions = [];
    newGridConfig.sortColumns = [];

    // copy columns
    newGridConfig.columns = this.columns.slice(0);
    newGridConfig.syncColumnRefs(this.$gridRef.$entityRef);

    // copy conditions
    for(let c of this.conditions) {
      let newGcc = Object.assign(new GridConfigCondition(newGridConfig), c);
      if (c.values) newGcc.values = c.values.slice(0); // clone value array if exists
      newGridConfig.conditions.push(newGcc);
    }

    // copy sortColumns
    for(let s of this.sortColumns) {
      newGridConfig.sortColumns.push(Object.assign(new GridConfigSort(), s));
    }

    return newGridConfig;
  }


}
