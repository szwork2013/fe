import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import {Tooltip, OverlayTrigger, Overlay, Popover} from 'react-bootstrap';

import MdField from 'core/metamodel/mdField';
import GridConfigCondition from 'core/grid/domain/gridConfigCondition';



export default class ConditionValue extends React.Component {

  static propTypes = {
    condition: React.PropTypes.instanceOf(GridConfigCondition)
  };

  state = {
  };



  render() {

    return (
      <div></div>
    );

  }


}

