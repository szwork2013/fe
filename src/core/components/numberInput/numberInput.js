import assign from 'object-assign';
import numeral from 'numeral';
import {Component, PropTypes, createElement} from 'react';

import React from 'react';
import ReactDOM from 'react-dom';
import ColorManipulator from 'material-ui/lib/utils/color-manipulator';
import StylePropable from 'material-ui/lib/mixins/style-propable';
import Transitions from 'material-ui/lib/styles/transitions';
import UniqueId from 'material-ui/lib/utils/unique-id';
import EnhancedTextarea from 'material-ui/lib/enhanced-textarea';

const DEFAULT_NUMBER_FORMAT = '0,0[.][00]';

//////////////////////////////////////////////////////////////////
// NumberInput functions
//////////////////////////////////////////////////////////////////
/**
 * Check if a given value is a valid number.
 *
 * @param   {any}
 * @returns {bool} True if given value is a valid number.
 */
export function isNumber(value) {
  return typeof value === 'number' && isFinite(value) && !isNaN(value)
}

/**
 * Safe conversion to numeral object. Numeral crashes with the value is
 * object or function.
 *
 * @param   {any}
 * @returns {numeral}
 */
export function toNumeral(value) {
  const type = typeof value

  if (type === 'object' || type === 'function' || type === 'boolean') {
    return null
  }

  const n = numeral(value)

  // numeral.js converts empty strings into 0 for no reason, so if given
  // value was not '0' or 0, treat it as null.
  if (n.value() === 0 && (value !== 0 && value !== '0')) {
    return null
  }

  // numeral.js can sometimes convert values (like '4.5.2') into NaN
  // and we would rather null than NaN.
  if (isNaN(n.value())) {
    return null
  }

  return n
}

/**
 * Convert given value to a number type. If conversion fails, returns NaN.
 *
 * @param   {any}
 * @returns {Number} NaN if conversion fails.
 */
export function parseNumber(value) {
  const n = toNumeral(value)
  return n ? n.value() : NaN
}

/**
 * Apply number formatting to given number value. If given value cannot be
 * converted to a number, returns null.
 *
 * @param   {any}
 * @returns {string}
 */
export function formatNumber(value, format = DEFAULT_NUMBER_FORMAT) {
  const n = toNumeral(value)
  return n ? n.format(format) : null
}

//////////////////////////////////////////////////////////////////
// React-number functions
//////////////////////////////////////////////////////////////////

/**
 * Check if a value is valid to be displayed inside an input.
 *
 * @param The value to check.
 * @returns True if the string provided is valid, false otherwise.
 */
function isValid(value) {
  return value || value === 0;
}

//////////////////////////////////////////////////////////////////
// React-textFiled modified class
//////////////////////////////////////////////////////////////////


/**
 * Komponenta textfield rozsirena o formatovani cisla podle property "format".
 * - pri ztrate focusu (blur) se vyrenderuje hodnota zformatovana dle zadaneho "format"
 * - pri ziskani focusu se vstupni pole vrati do stavu, v jakem ho vyplnil uzivatel
 */
let NumberInput = React.createClass({

  mixins: [StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  propTypes: {

    // numberInput props
    value: PropTypes.number.isRequired,
//    type: PropTypes.string,
    format: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,

    // textfield props
    errorStyle: React.PropTypes.object,
    errorText: React.PropTypes.string,
    floatingLabelStyle: React.PropTypes.object,
    floatingLabelText: React.PropTypes.string,
    fullWidth: React.PropTypes.bool,
    hintText: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element,
    ]),
    id: React.PropTypes.string,
    inputStyle: React.PropTypes.object,
    multiLine: React.PropTypes.bool,
    onBlur: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onEnterKeyDown: React.PropTypes.func,
    onFocus: React.PropTypes.func,
    onKeyDown: React.PropTypes.func,
    rows: React.PropTypes.number,
    type: React.PropTypes.string,
    underlineStyle: React.PropTypes.object,
    underlineFocusStyle: React.PropTypes.object,
  },

  getDefaultProps() {
    return {
      // numberInput default props
      value: null,
      type: 'tel',
      format: DEFAULT_NUMBER_FORMAT,
      onFocus: function() {},
      onBlur: function() {},
      onChange: function() {},

      // textfield default props
      fullWidth: false,
      type: 'text',
      rows: 1,
    };
  },

  getContextProps() {
    const theme = this.context.muiTheme;

    return {
      isRtl: theme.isRtl,
    };
  },

  getInitialState() {
    let props = (this.props.children) ? this.props.children.props : this.props;

    const value = parseNumber(this.props.value);

    return {
      errorText: this.props.errorText,
      hasValue: isValid(props.value) || isValid(props.defaultValue) ||
      (props.valueLink && isValid(props.valueLink.value)),
      focused: false,
      value: isNumber(value) ? value : ''
    };
  },

  getTheme() {
    return this.context.muiTheme.component.textField;
  },

  componentDidMount() {
    this._uniqueId = UniqueId.generate();
    // focused: check if component is focused after mounting and set state
    this.setState({
      isFocused: global.document.activeElement === this.refs.input
    })
  },

  componentWillReceiveProps(nextProps) {
    let newState = {};

    if (!this.state.isFocused && 'value' in props) {
      const value = parseNumber(props.value)
      newState.value = isNumber(value) ? value : '';
    }

    newState.errorText = nextProps.errorText;
    if (nextProps.children && nextProps.children.props) {
      nextProps = nextProps.children.props;
    }

    let hasValueLinkProp = nextProps.hasOwnProperty('valueLink');
    let hasValueProp = nextProps.hasOwnProperty('value');
    let hasNewDefaultValue = nextProps.defaultValue !== this.props.defaultValue;

    if (hasValueLinkProp) {
      newState.hasValue = isValid(nextProps.valueLink.value);
    }
    else if (hasValueProp) {
      newState.hasValue = isValid(nextProps.value);
    }
    else if (hasNewDefaultValue) {
      newState.hasValue = isValid(nextProps.defaultValue);
    }

    if (newState) this.setState(newState);
  },

  // onChange nastavuje state.value na aktualni hodnotu
  onChange(event) {
    event.persist();
    this.setState(
      { value: event.target.value }
    );
  },

  /**
   * vrati zformatovanou hodnotu dle zadaneho "format"
   *
   * @returns {string}
     */
  valueAsFormatted() {
    const value = this.state.value
    const n = toNumeral(value);
    return n ? n.format(this.props.format) : ''
  },

  getStyles() {
    let props = this.props;
    let theme = this.getTheme();
    const contextProps = this.getContextProps();

    let styles = {
      root: {
        fontSize: 16,
        lineHeight: '24px',
        width: props.fullWidth ? '100%' : 256,
        height: (props.rows - 1) * 24 + (props.floatingLabelText ? 72 : 48),
        display: 'inline-block',
        position: 'relative',
        fontFamily: this.context.muiTheme.contentFontFamily,
        transition: Transitions.easeOut('200ms', 'height'),
      },
      error: {
        position: 'relative',
        bottom: 5,
        fontSize: 12,
        lineHeight: '12px',
        color: theme.errorColor,
        transition: Transitions.easeOut(),
      },
      hint: {
        position: 'absolute',
        lineHeight: '22px',
        opacity: 1,
        color: theme.hintColor,
        transition: Transitions.easeOut(),
        bottom: 12,
      },
      input: {
        tapHighlightColor: 'rgba(0,0,0,0)',
        padding: 0,
        position: 'relative',
        width: '100%',
        height: '100%',
        border: 'none',
        outline: 'none',
        backgroundColor: theme.backgroundColor,
        color: props.disabled ? theme.disabledTextColor : theme.textColor,
        font: 'inherit',
      },
      underline: {
        border: 'none',
        borderBottom: 'solid 1px ' + theme.borderColor,
        position: 'absolute',
        width: '100%',
        bottom: 8,
        margin: 0,
        MozBoxSizing: 'content-box',
        boxSizing: 'content-box',
        height: 0,
      },
      underlineAfter: {
        position: 'absolute',
        width: '100%',
        overflow: 'hidden',
        userSelect: 'none',
        cursor: 'default',
        bottom: 8,
        borderBottom: 'dotted 2px ' + theme.disabledTextColor,
      },
      underlineFocus: {
        borderBottom: 'solid 2px',
        borderColor: theme.focusColor,
        transform: 'scaleX(0)',
        transition: Transitions.easeOut(),
      },
    };

    styles.error = this.mergeAndPrefix(styles.error, props.errorStyle);
    styles.underline = this.mergeAndPrefix(styles.underline, props.underlineStyle);

    styles.floatingLabel = this.mergeStyles(styles.hint, {
      lineHeight: '22px',
      top: 38,
      bottom: 'none',
      opacity: 1,
      transform: 'scale(1) translate3d(0, 0, 0)',
      transformOrigin: contextProps.isRtl ? 'right top' : 'left top',
    });

    styles.textarea = this.mergeStyles(styles.input, {
      marginTop: props.floatingLabelText ? 36 : 12,
      marginBottom: props.floatingLabelText ? -36 : -12,
      boxSizing: 'border-box',
      font: 'inherit',
    });

    styles.focusUnderline = this.mergeStyles(styles.underline, styles.underlineFocus, props.underlineFocusStyle);

    if (this.state.isFocused) {
      styles.floatingLabel.color = theme.focusColor;
      styles.floatingLabel.transform = 'perspective(1px) scale(0.75) translate3d(2px, -28px, 0)';
      styles.focusUnderline.transform = 'scaleX(1)';
    }

    if (this.state.hasValue) {
      styles.floatingLabel.color = ColorManipulator.fade(props.disabled ? theme.disabledTextColor : theme.floatingLabelColor, 0.5);
      styles.floatingLabel.transform = 'perspective(1px) scale(0.75) translate3d(2px, -28px, 0)';
      styles.hint.opacity = 0;
    }

    if (props.floatingLabelText) {
      styles.hint.opacity = 0;
      styles.input.boxSizing = 'border-box';
      if (this.state.isFocused && !this.state.hasValue) styles.hint.opacity = 1;
    }

    if (props.style && props.style.height) {
      styles.hint.lineHeight = props.style.height;
    }

    if (this.state.errorText && this.state.isFocused) styles.floatingLabel.color = styles.error.color;
    if (props.floatingLabelText && !props.multiLine) styles.input.paddingTop = 26;

    if (this.state.errorText) {
      styles.focusUnderline.borderColor = styles.error.color;
      styles.focusUnderline.transform = 'scaleX(1)';
    }

    return styles;
  },

  render() {
    let {
      value,
      format,
      min,
      max,

      className,
      errorStyle,
      errorText,
      floatingLabelText,
      fullWidth,
      hintText,
      id,
      multiLine,
      onBlur,
      onChange,
      onFocus,
      type,
      rows,
      ...other,
      } = this.props;

    let styles = this.getStyles();

    let inputId = id || this._uniqueId;

    let errorTextElement = this.state.errorText ? (
    <div style={styles.error}>{this.state.errorText}</div>
  ) : null;

    let hintTextElement = hintText ? (
    <div style={this.mergeAndPrefix(styles.hint)}>{hintText}</div>
  ) : null;

    let floatingLabelTextElement = floatingLabelText ? (
    <label
      style={this.mergeAndPrefix(styles.floatingLabel, this.props.floatingLabelStyle)}
    htmlFor={inputId}>
      {floatingLabelText}
      </label>
  ) : null;

    let inputProps;
    let inputElement;

    // hodnota, ktera se vypise je:
    //    a) pri focusu jednoduse vypsana (tak jak ji uzivatel vlozil),
    //    b) pri "nefocusu" vypsana zformatovana dle zadaneho "format"
    const displayValue = this.state.isFocused ? this.state.value : this.valueAsFormatted();

    inputProps = {
      id: inputId,
      ref: this._getRef(),
      style: this.mergeAndPrefix(styles.input, this.props.inputStyle),
      onBlur: this._handleInputBlur,
      onFocus: this._handleInputFocus,
      disabled: this.props.disabled,
      onKeyDown: this._handleInputKeyDown,
      value: displayValue,
    };

    if (!this.props.hasOwnProperty('valueLink')) {
      inputProps.onChange = this._handleInputChange;
    }
    if (this.props.children) {
      inputElement = React.cloneElement(this.props.children, {...inputProps, ...this.props.children.props});
    }
    else {
      inputElement = multiLine ? (
      <EnhancedTextarea
      {...other}
      {...inputProps}
      rows={rows}
      onHeightChange={this._handleTextAreaHeightChange}
      textareaStyle={this.mergeAndPrefix(styles.textarea)} />
    ) : (
      <input
      {...other}
      {...inputProps}
      type={type} />
    );
    }

    let underlineElement = this.props.disabled ? (
    <div style={this.mergeAndPrefix(styles.underlineAfter)}></div>
  ) : (
    <hr style={this.mergeAndPrefix(styles.underline)}/>
  );
    let focusUnderlineElement = <hr style={this.mergeAndPrefix(styles.focusUnderline)} />;

    return (
      <div className={className} style={this.mergeAndPrefix(styles.root, this.props.style)}>
    {floatingLabelTextElement}
    {hintTextElement}
    {inputElement}
    {underlineElement}
    {focusUnderlineElement}
    {errorTextElement}
  </div>
  );
  },

  blur() {
    if (this.isMounted()) this._getInputNode().blur();
  },

  clearValue() {
    this.setValue('');
  },

  focus() {
    if (this.isMounted()) this._getInputNode().focus();
  },

  getValue() {
    return this.isMounted() ? this._getInputNode().value : undefined;
  },

  setErrorText(newErrorText) {
    if (process.env.NODE_ENV !== 'production' && this.props.hasOwnProperty('errorText')) {
      console.error('Cannot call TextField.setErrorText when errorText is defined as a property.');
    }
    else if (this.isMounted()) {
      this.setState({errorText: newErrorText});
    }
  },

  setValue(newValue) {
    if (process.env.NODE_ENV !== 'production' && this._isControlled()) {
      console.error('Cannot call TextField.setValue when value or valueLink is defined as a property.');
    }
    else if (this.isMounted()) {
      if (this.props.multiLine) {
        this.refs[this._getRef()].setValue(newValue);
      }
      else {
        this._getInputNode().value = newValue;
      }

      this.setState({hasValue: isValid(newValue)});
    }
  },

  _getRef() {
    return this.props.ref ? this.props.ref : 'input';
  },

  _getInputNode() {
    return (this.props.children || this.props.multiLine) ?
      this.refs[this._getRef()].getInputNode() : ReactDOM.findDOMNode(this.refs[this._getRef()]);
  },

  _handleInputBlur(e) {
    this.setState({isFocused: false});
    if (this.props.onBlur) this.props.onBlur(e);
  },

  _handleInputChange(e) {
    // volani metody onChange z NumberField (nastavi aktualni hodnotu inputu do state)
    this.onChange(e);
    this.setState({hasValue: isValid(e.target.value)});
    if (this.props.onChange) this.props.onChange(e);
  },

  _handleInputFocus(e) {
    if (this.props.disabled)
      return;
    this.setState({isFocused: true});
    if (this.props.onFocus) this.props.onFocus(e);
  },

  _handleInputKeyDown(e) {
    if (e.keyCode === 13 && this.props.onEnterKeyDown) this.props.onEnterKeyDown(e);
    if (this.props.onKeyDown) this.props.onKeyDown(e);
  },

  _handleTextAreaHeightChange(e, height) {
    let newHeight = height + 24;
    if (this.props.floatingLabelText) newHeight += 24;
    React.findDOMNode(this).style.height = newHeight + 'px';
  },

  _isControlled() {
    return this.props.hasOwnProperty('value') ||
      this.props.hasOwnProperty('valueLink');
  },

});

module.exports = NumberInput;
