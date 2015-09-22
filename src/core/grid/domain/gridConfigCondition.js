import _ from 'lodash';

import Utils from 'core/common/utils/utils';

export default class GridConfigCondition {

  constructor () {

    // fieldKey, e.g. party_Party_partyCategory
    this.column;
    this.$columnRef;

    // FILTEROPERATOR, e.g. EQUAL
    this.operator;

    // list of values;
    this.values;


  }


}
