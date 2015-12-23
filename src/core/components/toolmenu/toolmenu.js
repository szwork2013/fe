import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {} from 'react-addons-pure-render-mixin';
import {Styles, IconButton, FontIcon} from 'material-ui';
import {customizeTheme}  from 'core/common/config/mui-theme';
import css from 'core/components/toolmenu/toolmenu.less';


const Colors = Styles.Colors;
const Typography = Styles.Typography;

export default class Toolmenu extends React.Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

  static contextTypes = {
    muiTheme: React.PropTypes.object
  };



  render() {

    let {
      children,
      style,
      ...other,
      } = this.props;

    return (
      <div className="toolmenu" style={style}>
        {
          React.Children.map(children, (child, index) => {
            return React.cloneElement(
              child,
              {
                key: index,
                style: Object.assign({},child.props.style, {
                  fontWeight: Typography.fontWeightNormal,
                  paddingLeft: 8,
                  paddingRight: 8
                })
              }
            );
          })
        }
      </div>
    )
  }

}

export const ZzIconButton = ({tooltip, fontIcon, style, iconStyle, onClick, className}) => (
  <IconButton onClick={onClick} tooltip={tooltip} className={className} style={Object.assign({
      height: 40,
      width: 40
    }, style)} iconStyle={Object.assign({fontSize: 15}, iconStyle)}>
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
