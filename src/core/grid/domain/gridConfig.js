import _ from 'lodash';

import Utils from 'core/common/utils/utils';

export default class GridConfig {

  constructor () {

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


}
