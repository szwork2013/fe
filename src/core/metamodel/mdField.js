import _ from 'lodash';


export default class MdField {

  constructor () {
    // fieldName
    this.fieldName = null;

    // main label
    this.label = null;

    // grid column label override
    this.gridHeaderLabel = null;

    // main tooltip
    this.tooltip = null;

    // grid column tooltip override
    this.gridHeaderTooltip = null;

  }


  get gridHeaderLabelActive() {
    return (this.gridHeaderLabel) ? this.gridHeaderLabel : this.label;
  }

  get gridHeaderTooltipActive() {
    return (this.gridHeaderTooltip) ? this.gridHeaderTooltip : this.tooltip;
  }

}

