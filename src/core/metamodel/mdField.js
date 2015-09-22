import _ from 'lodash';


export default class MdField {

  constructor () {
    // fieldName
    this.fieldName;

    // module_entityName_fieldName
    this.fieldKey;

    // main label
    this.label;

    // grid column label override
    this.gridHeaderLabel;

    // main tooltip
    this.tooltip;

    // grid column tooltip override
    this.gridHeaderTooltip;

    // column can be displayed in grid
    this.visible;

    // column can be used in grid filter
    this.filterable;

    // entityKey of entity providing values
    this.valueSource;

    // LOCAL x ASYNC
    this.valueSourceType;

    // available operators for grid filter conditions
    this.availableOperators;

  }


  get gridHeaderLabelActive() {
    return (this.gridHeaderLabel) ? this.gridHeaderLabel : this.label;
  }

  get gridHeaderTooltipActive() {
    return (this.gridHeaderTooltip) ? this.gridHeaderTooltip : this.tooltip;
  }

}

