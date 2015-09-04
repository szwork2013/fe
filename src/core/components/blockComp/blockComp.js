import React from 'react';
import {Styles, Paper} from 'material-ui';

import styles from 'core/components/blockComp/blockComp.less';


const Colors = Styles.Colors;
const Typography = Styles.Typography;

export default class BlockComp extends React.Component {

  static contextTypes = {
    muiTheme: React.PropTypes.object
  };

  static propTypes = {
    zDepth: React.PropTypes.number.isRequired,
    header: React.PropTypes.string
  };


  static defaultProps = {
    zDepth: 1
  };

  componentWillMount() {
    this.context.muiTheme.setComponentThemes({
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


    return (

    <Paper className="block-comp" zDepth={zDepth}>
      <h5>{header}</h5>
      <p>{children}</p>
    </Paper>


    )
  }


}
