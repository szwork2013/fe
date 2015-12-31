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
    index: React.PropTypes.number,
    onCommit: React.PropTypes.func
  };



  onClick = (evt) => {
    let {dataObject, setDataAction, rootObject} = this.props;

    if (!dataObject.$open) {
      dataObject.$open = true;
      setDataAction(rootObject);
      console.log('onClick %o', dataObject);
    }
  };

  onCommit = (evt) => {
    evt.stopPropagation();
    let {dataObject, setDataAction, rootObject, onCommit} = this.props;

    if (onCommit) {
      let res = onCommit(dataObject);
      if (!res) {
        return;
      }
    }
    dataObject.$open = false;
    setDataAction(rootObject);
    console.log('onCommit %o', dataObject);
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
        { (onDelete) ?  (<span className="active-item--delete fa fa-times"  onClick={onDelete}></span>) : ''}
      </div>
    );


  }


}
