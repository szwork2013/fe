import React from 'react';
import {Styles, Paper} from 'material-ui';
import {customizeTheme}  from 'core/common/config/mui-theme';
import classNames from 'classnames';

import css from 'core/components/blockComp/blockComp.less';


const Colors = Styles.Colors;

export default class BlockComp extends React.Component {

  static contextTypes = {
    muiTheme: React.PropTypes.object
  };

  static propTypes = {
    zDepth: React.PropTypes.number.isRequired,
    header: React.PropTypes.string,
    style: React.PropTypes.object,
    className: React.PropTypes.string
  };


  static defaultProps = {
    zDepth: 0
  };

  componentWillMount() {
    customizeTheme(this.context.muiTheme, {
      paper: {
        backgroundColor: Colors.grey50
      }
    });
  }

  render() {

    let {
      zDepth,
      header,
      children,
      style,
      className,
      ...other,
      } = this.props;

    if (header) {
      return (
        <Paper className={classNames('block-comp', className)} zDepth={zDepth} style={style}>
          <h5 style={{marginTop: 0, fontSize: '18px'}}>{header}</h5>
          <div>{children}</div>
        </Paper>
      );
    } else {
      return (
        <Paper className={classNames('block-comp', className)} zDepth={zDepth} style={style}>
          {children}
        </Paper>
      );
    }
  }


}
