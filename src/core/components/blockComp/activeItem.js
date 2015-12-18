import React from 'react';
import {Styles} from 'material-ui';
import classNames from 'classnames';

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



    let finalProps = {
      ...other,
      onClick: this.onClick
    };


    return (dataObject.$open) ? (
      <div className="active-item--open" {...finalProps}>
        {openContent}
        <ZzIconButton fontIcon="fa fa-check" className="active-item--check"  iconStyle={{color: Colors.green500, fontSize: 18}} onClick={this.onCommit} />
      </div>
    ) : (
      <div className={classNames('active-item--closed', {'active-item--not-last': !lastValue})} {...finalProps}>
        {closedContent}
        <span className="active-item--delete fa fa-times"  onClick={onDelete}></span>

      </div>
    );


  }


}
