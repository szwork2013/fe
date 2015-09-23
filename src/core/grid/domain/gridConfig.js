import _ from 'lodash';

import Utils from 'core/common/utils/utils';
import MdField from 'core/metamodel/mdField';
import GridConfigCondition from 'core/grid/domain/gridConfigCondition';

export default class GridConfig {

  constructor (grid) {

    this.$gridRef = grid;

    // list of fieldKeys
    this.columns = null;

    // array of MdField (doplneno pozdeji ve GridService#fetchGrids() )
    this.$columnRefs = null;

    // list of conditions
    this.conditions = null;

    // entity key
    this.entity = null;

    this.gridId = null;

    this.gridLocation = null;

    // PUBLIC vs PRIVATE vs SEARCH?
    this.gridUse = null;

    // lokalizovany nazev
    this.label = null;

    // [{field : fieldKey, fixed: true|false, sortOrder: ASC|DESC}, ...]
    this.sortColumns = null;

    // pole sirek sloupcu, pouze pro tento gridConfig, bez dat
    this.gridWidths = null;

  }


  syncColumnRefs(entityRef) {
    this.$columnRefs = [];
    for(let fieldKey of this.columns) {
      let fk = Utils.parseId(fieldKey);
      let mdField = entityRef.getField(fk[2]);
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
        newGridConfig.sortColumns.push(Object.assign({}, s));
      }
    }

    return newGridConfig;
  }


}
