import React from 'react';
import {Styles} from 'material-ui';
import {customizeTheme}  from 'core/common/config/mui-theme';
import styles from 'core/components/toolmenu/toolmenu.less';


const Colors = Styles.Colors;
const Typography = Styles.Typography;

export default class Toolmenu extends React.Component {

  static contextTypes = {
    muiTheme: React.PropTypes.object
  };


  componentWillMount() {
    customizeTheme(this.context.muiTheme, {
      button: {
        height: 40
      },
      flatButton: {
        color: Colors.blueGrey50
      }
    });
  }

  render() {

    let {
      children,
      style,
      ...other,
      } = this.props;


    return (
      <div className="toolmenu" style={style}>
        {
          children.map((child, index) => {

            return React.cloneElement(
              child,
              {
                key: index,
                style: Object.assign({},child.props.style, {
                  fontWeight: Typography.fontWeightNormal,
                  textTransform: 'none',
                  paddingLeft: 8,
                  paddingRight: 8
                }),
              }
            );

            return child;
          })
        }


      </div>
    )
  }


}
