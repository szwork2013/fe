import _ from 'lodash';


export default class MdField {

  constructor () {
    // fieldName
    this.fieldName = null;

    // main label
    this.label = null;

    // grid column label override
    this.gridHeaderLabel = null;

  }


  get gridHeaderLabelActive() {
    return (this.gridHeaderLabel) ? this.gridHeaderLabel : this.label;
  }


}

