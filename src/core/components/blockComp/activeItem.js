import React from 'react';
import {Styles} from 'material-ui';
import {customizeTheme}  from 'core/common/config/mui-theme';
import {ZzIconButton} from 'core/components/toolmenu/toolmenu';

import css from 'core/components/blockComp/activeItem.less';

const Colors = Styles.Colors;

export default class ActiveItem extends React.Component {

  static propTypes = {
    dataObject: React.PropTypes.object.isRequired,
    rootObject: React.PropTypes.object.isRequired,
    entities: React.PropTypes.object.isRequired,
    setDataAction: React.PropTypes.func.isRequired,
    lastValue: React.PropTypes.bool,
    index: React.PropTypes.number
  };



  onMouseEnter = (evt) => {
    this.props.dataObject.$hovered = true;
    this.props.setDataAction(this.props.rootObject);
    //console.log('onMouseEnter %o', this.props.dataObject);
  };
  onMouseLeave = (evt) => {
    this.props.dataObject.$hovered = false;
    this.props.setDataAction(this.props.rootObject);
    //console.log('onMouseLeave %o', this.props.dataObject);
  };
  onFocus = (evt) => {
    this.props.dataObject.$focused = true;
    this.props.setDataAction(this.props.rootObject);
    //console.log('onFocus %o', this.props.dataObject);
  };
  onBlur = (evt) => {
    this.props.dataObject.$focused = false;
    this.props.setDataAction(this.props.rootObject);
    //console.log('onBlur %o', this.props.dataObject);
  };
  onClick = (evt) => {
    this.props.dataObject.$open = true;
    this.props.setDataAction(this.props.rootObject);
    console.log('onClick %o', this.props.dataObject);
  };

  onCommit = (evt) => {
    evt.stopPropagation();
    Object.assign(this.props.dataObject, {$open: false, $focused: false, $hovered: false});
    this.props.setDataAction(this.props.rootObject);
    console.log('onCommit %o', this.props.dataObject);
  };



  render() {

    let {
      lastValue,
      dataObject,
      openContent,
      closedContent,
      onDelete,
      ...other
      } = this.props;


    const style = {paddingTop: 10, paddingLeft: 5, paddingRight: 5};

    // kdyz neni posledni v seznamu
    if (!lastValue) Object.assign(style, {
      borderBottom: '1px solid',
      borderBottomColor: Colors.grey300,
      paddingBottom: 10
    });

    const deleteIconStyle = {};

    // highlighted
    if ((dataObject.$focused || dataObject.$hovered) && !dataObject.$open) {
      style.backgroundColor = Colors.grey300;
    } else {
      deleteIconStyle.display = 'none';
    }

    // opened
    if (dataObject.$open) {
      style.border = '2px solid';
      style.borderColor = Colors.blue500;
    } else {
      // closed
      Object.assign(style, {display: 'flex', justifyContent: 'space-between'});
    }


    let finalProps = {
      ...other,
      style,
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      onClick: this.onClick
    };


    return (dataObject.$open) ? (
      <div {...finalProps}>
        {openContent}
        <ZzIconButton fontIcon="fa fa-check" className="active-item--check"  iconStyle={{color: Colors.green500, fontSize: 18}} onClick={this.onCommit} />
      </div>
    ) : (
      <div {...finalProps}>
        {closedContent}
        <span className="active-item--delete fa fa-times" style={deleteIconStyle} onClick={onDelete}></span>

      </div>
    );


  }


}
