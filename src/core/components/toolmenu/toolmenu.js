import React from 'react';
import {Styles, IconButton, FontIcon} from 'material-ui';
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

export const ZzIconButton = ({tooltip, fontIcon, onClick}) => (
  <IconButton onClick={onClick} tooltip={tooltip} style={{
      height: 40,
      width: 40
    }} iconStyle={{fontSize: 15}}>
    <FontIcon className={fontIcon} />
  </IconButton>
);


export class ZzIconButtonRoute extends React.Component {
  static contextTypes = {
    router: React.PropTypes.func.isRequired
  };

  onClick = (event) => {
    event.preventDefault();
    const {routeName, params, query} = this.props;
    this.context.router.transitionTo(routeName, params, query);
  };

  render() {
    const {tooltip, fontIcon, routeName, params, query} = this.props;

    return (
      <a href={this.context.router.makeHref(routeName, params, query)} onClick={this.onClick}>
        <IconButton tooltip={tooltip} style={{height: 40,width: 40}} iconStyle={{fontSize: 15}}>
          <FontIcon className={fontIcon}/>
        </IconButton>
      </a>
    );

  }

}
