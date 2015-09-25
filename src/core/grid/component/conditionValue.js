import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import {Tooltip, OverlayTrigger, Overlay, Popover} from 'react-bootstrap';
import {TextField} from 'material-ui';

import MdField from 'core/metamodel/mdField';
import GridConfigCondition from 'core/grid/domain/gridConfigCondition';
import FilterFieldComp from 'core/grid/component/filterFieldComp';



export default class ConditionValue extends React.Component {

  static propTypes = {
    condition: React.PropTypes.instanceOf(GridConfigCondition)
  };

  state = {

  };



  render() {

    let {
        condition,
        ...other
        } = this.props;

    let operator = condition.operator;

    if ( _.includes(['EQUAL', 'NOT_EQUAL', 'STARTS_WITH', 'NOT_STARTS_WITH', 'ENDS_WITH', 'NOT_ENDS_WITH', 'GREATER_THAN', 'GREATER_OR_EQUAL_THAN',
          'LESS_THAN', 'LESS_OR_EQUAL_THAN', 'CONTAINS', 'NOT_CONTAINS', 'LAST_X_DAYS', 'NEXT_X_DAYS'],
        operator) ) {
      if (!condition.values || condition.values.length !== 1) {
        condition.values = [null];
      }
      return (
        <FilterFieldComp name={condition.column} label="Vypln hodnotu" field={condition.$columnRef} value={condition.values[0]} />
      );
    } else if ( _.includes(['IN', 'NOT_IN'], operator) ) {
      return (
        <FilterFieldComp name={condition.column} label="Vyber hodnoty" field={condition.$columnRef} value={condition.values} multi={true} />
      );
    } else if (operator === 'FROM_TO') {
      if (!condition.values || condition.values.length !== 2) {
        condition.values = [null, null];
      }
      return (
        <div>
          <FilterFieldComp name={condition.column + 'From'} label="od" field={condition.$columnRef} value={condition.values[0]} />
          -
          <FilterFieldComp name={condition.column + 'To'} label="do" field={condition.$columnRef} value={condition.values[1]} />
        </div>
      );

    } else if ( _.includes(['IS_TRUE', 'IS_FALSE'], operator) ) {
      return null;
    } else {
      return null;
    }

  }




}

