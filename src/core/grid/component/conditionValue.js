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
    condition: React.PropTypes.instanceOf(GridConfigCondition),
    onChange: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = this.deriveState(props);
  }

  deriveState(props) {
    let value2 = (props.values && props.values.length >= 2) ? values[1] : null;
    let values = (props.values) ? props.values.slice() : null;
    return {
      value1: _.first(props.values),
      value2: value2,
      values: values
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.deriveState(nextProps));
  }

  onChangeValue1 = (v) => {
    this.props.condition.values[0] = v;
    this.props.onChange(this.props.condition);
  };

  onChangeValue2 = (v) => {
    this.props.condition.values[1] = v;
    this.props.onChange(this.props.condition);
  };

  onChangeValues = (vs) => {
    this.props.condition.values = vs;
    this.props.onChange(this.props.condition);
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
      return (
        <FilterFieldComp name={condition.column} label="Vypln hodnotu" field={condition.$columnRef} value={condition.values[0]} onChange={this.onChangeValue1} />
      );
    } else if ( _.includes(['IN', 'NOT_IN'], operator) ) {
      return (
        <FilterFieldComp name={condition.column} label="Vyber hodnoty" field={condition.$columnRef} value={condition.values} multi={true} onChange={this.onChangeValues} />
      );
    } else if (operator === 'FROM_TO') {
      return (
        <div>
          <FilterFieldComp name={condition.column + 'From'} label="od" field={condition.$columnRef} value={condition.values[0]} onChange={this.onChangeValue1} />
          -
          <FilterFieldComp name={condition.column + 'To'} label="do" field={condition.$columnRef} value={condition.values[1]} onChange={this.onChangeValue2} />
        </div>
      );

    } else if ( _.includes(['IS_TRUE', 'IS_FALSE'], operator) ) {
      return null;
    } else {
      return null;
    }

  }




}

