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
    validate: React.PropTypes.func.isRequired,
    formName: React.PropTypes.string.isRequired
  };



  onClick = (evt) => {
    let {dataObject, setDataAction, rootObject, formName} = this.props;

    if (!dataObject.$forms[formName].open) {
      dataObject.$forms[formName].open = true;
      setDataAction(rootObject);
      console.log('onClick %o', dataObject);
    }
  };

  onCommit = (evt) => {
    evt.stopPropagation();
    let {dataObject, setDataAction, rootObject, validate, formName} = this.props;

    let res = validate(dataObject);
    if (!res) return;

    let form = dataObject.$forms[formName];
    form.open = false;
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
      formName,
      ...other
      } = this.props;



    let finalProps = {
      ...other,
      onClick: this.onClick
    };


    return (dataObject.$forms[formName].open) ? (
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
