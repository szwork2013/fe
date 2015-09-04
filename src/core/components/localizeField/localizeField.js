import React from 'react';

import styles from 'core/components/localizeField/localizeField.less';


export default class LocalizeField extends React.Component {


  render() {

    let {
      children,
      style,
      ...other,
      } = this.props;


    return (
      <span className="lozalize-field fa fa-globe"></span>
    )
  }


}
