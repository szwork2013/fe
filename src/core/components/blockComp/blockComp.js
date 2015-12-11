import React from 'react';
import {Styles, Paper} from 'material-ui';
import {customizeTheme}  from 'core/common/config/mui-theme';
import css from 'core/components/blockComp/blockComp.less';


const Colors = Styles.Colors;

export default class BlockComp extends React.Component {

  static contextTypes = {
    muiTheme: React.PropTypes.object
  };

  static propTypes = {
    zDepth: React.PropTypes.number.isRequired,
    header: React.PropTypes.string,
    style: React.PropTypes.object
  };


  static defaultProps = {
    zDepth: 1
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
      ...other,
      } = this.props;

    if (header) {
      return (
        <Paper className="block-comp" zDepth={zDepth} style={style}>
          <h5 style={{marginTop: 0, fontSize: '18px'}}>{header}</h5>
          <div>{children}</div>
        </Paper>
      );
    } else {
      return (
        <Paper className="block-comp" zDepth={zDepth} style={style}>
          {children}
        </Paper>
      );
    }
  }


}
