import React from 'react';

import {Tooltip, OverlayTrigger} from 'react-bootstrap';

import MdField from 'core/metamodel/mdField';


export default class GridHeader extends React.Component {

  static propTypes = {
    field: React.PropTypes.instanceOf(MdField).isRequired,
    sortArray: React.PropTypes.arrayOf(React.PropTypes.object),
    onClickLink: React.PropTypes.func
  };


  _onClickLink = (evt) => {
    console.log('_onClickLink: %o', this.props.field);
    let sortArray = this.props.sortArray;
    let newSortObject = {field: this.props.field, direction: 'ASC'};
    if (sortArray.length === 1) {
      let sortObject = sortArray[0];
      if (sortObject.field.fieldName === newSortObject.field.fieldName) {
        newSortObject.direction = (sortObject.direction === 'ASC') ? 'DESC' : 'ASC';
      }
    }
    this.props.onClickLink(newSortObject);
  };


  render() {
    let field = this.props.field;
    let sortArray = this.props.sortArray;
    let tooltipText = field.gridHeaderTooltipActive;

    let sorting;
    if (sortArray.length === 1) {
      let sortObject = sortArray[0];
      if (sortObject.field.fieldName === field.fieldName) {
        sorting = sortObject.direction;
      }
    }

    let tooltip = <Tooltip placement="top" id={field.fieldName}>{tooltipText}</Tooltip>;

    let anchor = <a onClick={this._onClickLink}>
      { (sorting) ? <span className={classNames('fa', {'long-arrow-up': sorting === 'ASC', 'long-arrow-down': sorting === 'DESC'})}/> : '' }
      {field.gridHeaderLabelActive}
    </a>

    return (

    (tooltipText) ?
    (
      <OverlayTrigger overlay={tooltip} delayShow={300} delayHide={150}>
        { anchor }
      </OverlayTrigger>
    ) :
      anchor
    );
  }


}
