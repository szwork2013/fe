import {capitalize} from 'lodash';
import moment from 'moment';

import {formatNumber} from 'core/components/numberInput/numberInput';


export default class MdField {

  constructor () {
    // fieldName
    this.fieldName;

    // entityName_fieldName
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

    // entityName of entity providing values
    this.valueSource;

    // LOCAL x ASYNC
    this.valueSourceType;

    // available operators for grid filter conditions
    this.availableOperators;

    // filter operator for rendering when selected operator is exists
    this.existsFilterOperator;

    // route pro kliknuti na policko v gridu
    this.detailRoute;

    //   BOOLEAN, NUMBER, STRING, DATE,DATETIME
    this.dataType;

    // left,right,center
    this.textAlign;

    // FUNCTION, URL
    this.actionType;

    // BUTTON, ICON
    this.actionDisplay;

    // jmeno funkce pro FUNCTION actionType
    functionName;

  }



  get gridHeaderLabelActive() {
    return (this.gridHeaderLabel) ? this.gridHeaderLabel : this.label;
  }

  get gridHeaderTooltipActive() {
    return (this.gridHeaderTooltip) ? this.gridHeaderTooltip : this.tooltip;
  }

  formatValue(value) {
    switch (this.dataType) {
      case "DATE":
        return moment(value).format('L');
      case "DATETIME":
        return moment(value).format('L LTS');
      case "NUMBER":
        return formatNumber(value, '0,0.00');
      case "BOOLEAN":
        return value;
      default:
        return value;
    }
  }

  hasLocalValueSource() {
    return (this.valueSource && this.valueSourceType === 'LOCAL');
  }

  functionNameGetter() {
    return 'get' + capitalize(this.functionName);
  }

  functionNameSetter() {
    return 'set' + capitalize(this.functionName);
  }


}

