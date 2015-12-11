import React from 'react';
import {Styles} from 'material-ui';
import {customizeTheme}  from 'core/common/config/mui-theme';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';

const Colors = Styles.Colors;

export default class ActiveItem extends React.Component {


  //static defaultProps = {
  //  zDepth: 1
  //};

  state = {
    hovered: false,
    focused: false,
    open: false
  };


  onMouseEnter = (evt) => {
    console.log('onMouseEnter');
    this.setState({hovered:true});
  };
  onMouseLeave = (evt) => {
    console.log('onMouseLeave');
    this.setState({hovered:false});
  };
  onFocus = (evt) => {
    console.log('onFocus');
    this.setState({focused:true});
  };
  onBlur = (evt) => {
    console.log('onBlur');
    this.setState({focused:false});
  };
  onClick = (evt) => {
    console.log('onClick');
    this.setState({open:true});
  };

  componentWillMount() {
    //this.setState(style=);
  }

  render() {

    let {
      children,
      style,
      openContent,
      ...other
      } = this.props;

    const newStyle = Object.assign({}, style, {backgroundColor: (this.state.focused || this.state.hovered) ? Colors.grey300 : null});

    let finalProps = {
      ...other,
      style: newStyle,
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      onClick: this.onClick
    };

    return (
      <div {...finalProps}>
        { (this.state.open) ? openContent : children }
      </div>
    );

  }


}
