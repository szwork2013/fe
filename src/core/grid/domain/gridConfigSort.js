import _ from 'lodash';

import Utils from 'core/common/utils/utils';

export default class GridConfigSort {

  constructor (gridConfig) {
// field : fieldKey, fixed: true|false, sortOrder: ASC|DESC},
    // zpetna reference na parenta
    this.$gridConfigRef = gridConfig;

    // fieldKey, e.g. Party_partyCategory
    this._field;
    this.$fieldRef;

    // true | false
    this.fixed;

    //  sortOrder: ASC|DESC}
    this.sortOrder;

  }

  get field() {
    return this._field;
  }

  set field(field) {
    this._field = field;
    this.$fieldRef = this.$gridConfigRef.$gridRef.$entityRef.fields[Utils.parseId(field).pop()];
  }

  // musi byt kvuli https://github.com/babel/babel/issues/1469
  toJSON() {
    return {
      field: this.field,
      fixed: this.fixed,
      sortOrder: this.sortOrder
    };
  }

}
