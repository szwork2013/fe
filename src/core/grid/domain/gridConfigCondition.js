import _ from 'lodash';

import Utils from 'core/common/utils/utils';

export default class GridConfigCondition {

  constructor (gridConfig) {

    this.$gridConfigRef = gridConfig;

    // fieldKey, e.g. party_Party_partyCategory
    this._column;
    this.$columnRef;

    // FILTEROPERATOR, e.g. EQUAL
    this.operator;

    // list of values;
    this.values;

  }

  get column() {
    return this._column;
  }

  set column(column) {
    this._column = column;
    this.$columnRef = grid.$gridRef.$entityRef.fields[Utils.parseId(column).pop()];
  }



}
