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

    // implicit;
    this.implicit;

  }

  get column() {
    return this._column;
  }

  get columnName() {
    return this.$columnRef.fieldName;
  }


  set column(column) {
    this._column = column;
    this.$columnRef = this.$gridConfigRef.$gridRef.$entityRef.fields[Utils.parseId(column).pop()];
  }

  setColumnRef(mdField) {
    this._column = mdField.fieldKey;
    this.$columnRef = mdField;
  }

  // musi byt kvuli https://github.com/babel/babel/issues/1469
  toJSON() {
    return {
      column: this.column,
      operator: this.operator,
      values: this.values,
      implicit: this.implicit
    };
  }

}
