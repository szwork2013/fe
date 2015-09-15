import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import {Tooltip, OverlayTrigger} from 'react-bootstrap';

import MdField from 'core/metamodel/mdField';



export default class GridHeader extends React.Component {

  static propTypes = {
    field: React.PropTypes.instanceOf(MdField).isRequired,
    sortArray: React.PropTypes.arrayOf(React.PropTypes.object),
    onClickLink: React.PropTypes.func
  };

  state = {
    showFilterIcon: false
  };


  _onClickLink = (evt) => {
    let field = this.props.field;
    console.log('_onClickLink: %o', field);
    let sortObject = _.find(this.props.sortArray, so => so.field.fieldName === field.fieldName);

    let newSortObject = {
      field: field,
      desc: (sortObject) ? !sortObject.desc : false
    };

    this.props.onClickLink(newSortObject);
  };

  onClickFilter = (evt) => {
    let field = this.props.field;
    console.log('onClickFilter: %o', field);
  };

  onMouseOver = (evt) => {
    this.setState({showFilterIcon: true});
  };
  onMouseOut = (evt) => {
    this.setState({showFilterIcon: false});
  };


  render() {
    let field = this.props.field;
    let sortArray = this.props.sortArray;
    let tooltipText = field.gridHeaderTooltipActive;

    let sortObject = _.find(sortArray, so => so.field.fieldName === field.fieldName);
    let desc = (sortObject && sortObject.desc) ? true : false;


    let tooltip = <Tooltip placement="top" id={field.fieldName}>{tooltipText}</Tooltip>;

    let filter = (
      <a onClick={this.onClickFilter} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
        <span className={classNames('fa', 'fa-filter', {'invisible': !this.state.showFilterIcon})}/>
      </a>
    );


    let anchor = (
      <a onClick={this._onClickLink} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
        { (sortObject) ? (
          <span className={classNames('fa', {'fa-long-arrow-up': !desc, 'fa-long-arrow-down': desc})}> </span> ) : '' }
        {field.gridHeaderLabelActive}
      </a>
    );

    return (

    (tooltipText) ?
    (
      <OverlayTrigger overlay={tooltip} delayShow={300} delayHide={150}>
        <span>{ anchor } { filter } </span>
      </OverlayTrigger>
    ) :
    ( <span> { anchor } { filter } </span> )

    );
  }


}
