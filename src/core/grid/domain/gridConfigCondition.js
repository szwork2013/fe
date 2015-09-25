import _ from 'lodash';

import Utils from 'core/common/utils/utils';

export default class GridConfigCondition {

  constructor (gridConfig) {

    // zpetna reference na parenta
    this.$gridConfigRef = gridConfig;

    // fieldKey, e.g. Party_partyCategory
    this._column;
    this.$columnRef;

    // FILTEROPERATOR, e.g. EQUAL
    this.operator;

    // array of values;
    this.values;

  }

  get column() {
    return this._column;
  }

  set column(column) {
    this._column = column;
    this.$columnRef = this.$gridConfigRef.$gridRef.$entityRef.fields[Utils.parseId(column).pop()];
  }



}
