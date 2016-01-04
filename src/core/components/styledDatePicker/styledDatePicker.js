import React from 'react';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import Popup from 'react-widgets/lib/Popup';

import MaterialStyles from 'material-ui/lib/utils/styles';
import UniqueId from 'material-ui/lib/utils/unique-id';
import 'react-widgets/lib/less/react-widgets.less';
import 'core/components/styledDatePicker/styledDatePicker.less';


export default class StyledDatePicker extends React.Component {

  static propTypes = {
    defaultValue:   React.PropTypes.instanceOf(Date),
    value:          React.PropTypes.instanceOf(Date),
    onChange:       React.PropTypes.func,
    //open:           React.PropTypes.oneOf([false, popups.TIME, popups.CALENDAR]),
    onToggle:       React.PropTypes.func,

    min:            React.PropTypes.instanceOf(Date),
    max:            React.PropTypes.instanceOf(Date),
//    format:         CustomPropTypes.dateFormat,
//    timeFormat:     CustomPropTypes.dateFormat,
//    editFormat:     CustomPropTypes.dateFormat,
    culture:        React.PropTypes.string,
    calendar:       React.PropTypes.bool,
    time:           React.PropTypes.bool,

    placeholder:    React.PropTypes.string,
    name:           React.PropTypes.string,

//    initialView:    React.PropTypes.oneOf(viewEnum),
//    finalView:      React.PropTypes.oneOf(viewEnum),

//    disabled:       CustomPropTypes.disabled,
//    readOnly:       CustomPropTypes.readOnly,
    autoFocus:      React.PropTypes.bool,

    style:          React.PropTypes.object,
    errorText:      React.PropTypes.string,

    floatingLabelStyle: React.PropTypes.object,
    floatingLabelText: React.PropTypes.node,
    id: React.PropTypes.string,
  };

  static defaultProps = {
      time:             false,
  };

  constructor(props) {
    super(props);

    this.state = {
      focused: false
    }
  }

  componentDidMount() {
    this._uniqueId = UniqueId.generate();
  }

  onBlurEvent = (e) => {
    this.setState({focused: false});
  };

  onFocusEvent = (e) => {
    this.setState({focused: true});
  };

  render() {

    let {
      defaultValue,
      value,
      onChange,
      open,
      onToggle,
      min,
      max,
//      format,
//      timeFormat,
//      editFormat,
      culture,
      calendar,
      time,

      placeholder,
      name,
//      initialView,
//      finalView,

//      disabled,
//      readOnly,
      autoFocus,
      style,
      errorText,
      floatingLabelStyle,
      floatingLabelText,
      id,
      ...other,
      } = this.props;

    let inputId = id || this._uniqueId;

    let className = "StyledDatePicker";
    if (this.state.focused) {className += " is-focused";}
    if (errorText) {className += " is-error";}
    if ((value && (value.toString().length > 0))) {className += " has-value";}

    let localStyles = {
        position: 'relative',
    }

    let floatingLabelTextElement = floatingLabelText ? (
    <label className="DatePickerLabel"
      htmlFor={inputId}
      onTouchTap={this.focus}
      style={floatingLabelStyle}>
        {floatingLabelText}
      </label>) : null;

    return (
      <div className={className} style={MaterialStyles.mergeAndPrefix(localStyles, this.props.style)}>
        {floatingLabelTextElement}
        <div style={{position: 'relative', height: '100%'}}>
          <DateTimePicker onFocus={this.onFocusEvent} onBlur={this.onBlurEvent}
            defaultValue={defaultValue}
            value={value}
            onChange={onChange}
 //           open={open}
            onToggle={onToggle}
            calendar={calendar}
            time={time}
            culture={culture}
            min={min}
            max={max}
            placeholder={placeholder}
//            disabled={disabled}
//            readOnly={readOnly}
          />
          <hr className="underscore underscore-grey" />
          <hr className="underscore underscore-blue" />
        </div>
        {
          ( (errorText) ? (<div className="errorText">{errorText}</div>) : '' )
        }
      </div>
    )
  }


}
