import _ from 'lodash';

import Utils from 'core/common/utils/utils';
import MdField from 'core/metamodel/mdField';
import GridConfigCondition from 'core/grid/domain/gridConfigCondition';
import GridConfigSort from 'core/grid/domain/gridConfigSort';

export default class GridConfig {

  constructor (grid) {

    this.$gridRef = grid;

    // list of fieldKeys
    this.columns = null;

    // array of MdField (doplneno pozdeji ve GridService#fetchGrids() )
    this.$columnRefs = null;

    // array of GridConfigCondition
    this.conditions = null;

    // entity key
    this.entity = null;

    this.gridId = null;

    this.gridLocation = null;

    // PUBLIC vs PRIVATE vs SEARCH?
    this.gridUse = null;

    // lokalizovany nazev
    this.label = null;

    // array of GridConfigSort
    this.sortColumns = null;

    // pole sirek sloupcu, pouze pro tento gridConfig, bez dat
    this.gridWidths = null;

    // priznak, zda se maji radky pod mysi obarvovat
    this.showRowHover = false;
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

    // copy $columnRefs
    if (this.$columnRefs) {
      newGridConfig.$columnRefs = [];
      for(let f of this.$columnRefs) {
        newGridConfig.$columnRefs.push(Object.assign(new MdField(), f));
      }
    }

    // copy conditions
    if (this.conditions) {
      newGridConfig.conditions = [];
      for(let c of this.conditions) {
        let newGcc = Object.assign(new GridConfigCondition(), c);
        if (c.values) newGcc.values = c.values.slice(0); // clone value array if exists
        newGridConfig.conditions.push(newGcc);
      }
    }

    // copy sortColumns
    if (this.sortColumns) {
      newGridConfig.sortColumns = [];
      for(let s of this.sortColumns) {
        newGridConfig.sortColumns.push(Object.assign(new GridConfigSort(), s));
      }
    }

    return newGridConfig;
  }


}
