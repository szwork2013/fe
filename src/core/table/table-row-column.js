import React from 'react';
import { Mixins } from 'material-ui';

let TableRowColumn = React.createClass({

  mixins: [Mixins.StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  propTypes: {
    columnNumber: React.PropTypes.number,
    hoverable: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    onHover: React.PropTypes.func,
    onHoverExit: React.PropTypes.func,
    style: React.PropTypes.object,
    tooltip: React.PropTypes.string,
    tooltipStyle: React.PropTypes.object,
    columnWidth: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      hoverable: false,
    };
  },

  getInitialState() {
    return {
      hovered: false,
    };
  },

  getTheme() {
    return this.context.muiTheme.component.tableRowColumn;
  },

  getStyles() {
    let theme = this.getTheme();
    let styles = {
      root: {
        paddingLeft: 6,
        paddingRight: 6,
        height: theme.height,
        textAlign: 'left',
        fontSize: 12,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      },
      tooltip: {
        boxSizing: 'border-box',
        marginTop: theme.height / 2,
      }
    };

    if (React.Children.count(this.props.children) === 1 && !isNaN(this.props.children)) {
      styles.textAlign = 'right';
    }

    return styles;
  },

  render() {
    let {
      className,
      columnNumber,
      hoverable,
      onClick,
      onHover,
      onHoverExit,
      style,
      tooltip,
      tooltipStyle,
      columnWidth,
      ...other,
    } = this.props;
    let styles = this.getStyles();
    let handlers = {
      onClick: this._onClick,
      onMouseEnter: this._onMouseEnter,
      onMouseLeave: this._onMouseLeave,
    };
    let classes = 'mui-table-row-column';
    if (className) classes += ' ' + className;

    if (this.props.tooltip) {
      tooltip = (
        <Tooltip
          label={this.props.tooltip}
          show={this.state.hovered}
          style={this.mergeAndPrefix(styles.tooltip, tooltipStyle)} />
      );
    }

    return (
      <td
        key={this.props.key}
        className={classes}
        style={this.mergeAndPrefix(styles.root, style)}
        width={columnWidth}
        {...handlers}
        {...other}>
        {tooltip}
        {this.props.children}
      </td>
    );
  },

  _onClick(e) {
    if (this.props.onClick) this.props.onClick(e, this.props.columnNumber);
  },

  _onMouseEnter(e) {
    if (this.props.tooltip !== undefined || this.props.hoverable) {
      this.setState({hovered: true});
    }

    if (this.props.hoverable && this.props.onHover) {
      if (this.props.onHover) this.props.onHover(e, this.props.columnNumber);
    }
  },

  _onMouseLeave(e) {
    if (this.props.hoverable || this.props.tooltip !== undefined) {
      this.setState({hovered: false});
    }

    if (this.props.hoverable && this.props.onHoverExit) {
      this.props.onHoverExit(e, this.props.columnNumber);
    }
  },

});

export default TableRowColumn;
