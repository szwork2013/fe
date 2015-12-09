import React from 'react';
import Select from 'react-select';

import Styles from 'core/components/styledSelect/styledSelect.less';
import MaterialStyles from 'material-ui/lib/utils/styles';
import Transitions from 'material-ui/lib/styles/transitions';

/**
 * Komponenta StyledSelect v designu Material-UI.
 *
 * Komponenta pro vyber z nekolika moznosti s vyhledavanim. Podporuje mod "multi", ve kterem lze zvolit vice moznosti
 * zaroven. V "ne-multi" modu se komponenta v toku dokumentu chova jako komponenta TextField z material UI.
 *
 * V modu "multi" je komponenta dostylovana tak aby zapadala do material designu. V takovem pripade ma nastavenou
 * vysku na automatickou (height: auto) a minimalni vysku na 48px (min-height: 48px). Pro praci s velikosti kopmonenty
 * je treba prekryt minimalni vysku komponenty (min-height) namisto klasicke vysky (height), jak je tomu u TextField
 * z material-ui.
 *
 * @author mnemec
 */
export default class StyledSelect extends React.Component {

  static propTypes = {
    errorText: React.PropTypes.string,
    addLabelText: React.PropTypes.string,      // placeholder displayed when you want to add a label on a multi-value input
    allowCreate: React.PropTypes.bool,         // whether to allow creation of new entries
    asyncOptions: React.PropTypes.func,        // function to call to get options
    autoload: React.PropTypes.bool,            // whether to auto-load the default async options set
    backspaceRemoves: React.PropTypes.bool,    // whether backspace removes an item if there is no text input
    cacheAsyncResults: React.PropTypes.bool,   // whether to allow cache
    className: React.PropTypes.string,         // className for the outer element
    clearAllText: React.PropTypes.string,      // title for the "clear" control when multi: true
    clearValueText: React.PropTypes.string,    // title for the "clear" control
    clearable: React.PropTypes.bool,           // should it be possible to reset value
    delimiter: React.PropTypes.string,         // delimiter to use to join multiple values
    disabled: React.PropTypes.bool,            // whether the Select is disabled or not
    filterOption: React.PropTypes.func,        // method to filter a single option  (option, filterString)
    filterOptions: React.PropTypes.func,       // method to filter the options array: function ([options], filterString, [values])
    floatingLabelText: React.PropTypes.string,
    fullWidth: React.PropTypes.bool,
    ignoreCase: React.PropTypes.bool,          // whether to perform case-insensitive filtering
    inputProps: React.PropTypes.object,        // custom attributes for the Input (in the Select-control) e.g: {'data-foo': 'bar'}
    isLoading: React.PropTypes.bool,           // whether the Select is loading externally or not (such as options being loaded)
    labelKey: React.PropTypes.string,          // path of the label value in option objects
    matchPos: React.PropTypes.string,          // (any|start) match the start or entire string when filtering
    matchProp: React.PropTypes.string,         // (any|label|value) which option property to filter on
    multi: React.PropTypes.bool,               // multi-value input
    name: React.PropTypes.string,              // field name, for hidden <input /> tag
    newOptionCreator: React.PropTypes.func,    // factory to create new options when allowCreate set
    noResultsText: React.PropTypes.string,     // placeholder displayed when there are no matching search results
    onBlur: React.PropTypes.func,              // onBlur handler: function (event) {}
    onChange: React.PropTypes.func,            // onChange handler: function (newValue) {}
    onFocus: React.PropTypes.func,             // onFocus handler: function (event) {}
    onInputChange: React.PropTypes.func,       // onInputChange handler: function (inputValue) {}
    onOptionLabelClick: React.PropTypes.func,  // onCLick handler for value labels: function (value, event) {}
    optionComponent: React.PropTypes.func,     // option component to render in dropdown
    optionRenderer: React.PropTypes.func,      // optionRenderer: function (option) {}
    options: React.PropTypes.array,            // array of options
    searchable: React.PropTypes.bool,          // whether to enable searching feature or not
    searchingText: React.PropTypes.string,     // message to display whilst options are loading via asyncOptions
    searchPromptText: React.PropTypes.string,  // label to prompt for search input
    singleValueComponent: React.PropTypes.func,// single value component when multiple is set to false
    value: React.PropTypes.any,                // initial field value
    valueComponent: React.PropTypes.func,      // value component to render in multiple mode
    valueKey: React.PropTypes.string,          // path of the label value in option objects
    valueRenderer: React.PropTypes.func        // valueRenderer: function (option) {}
  };

  constructor(props) {
    super(props);

    this.state = {
      focused: false,
    }
  }

  getStyles() {
    const props = this.props;

    let styles = {
      root: {
        fontSize: 16,
        lineHeight: '24px',
        width: props.fullWidth ? '100%' : 256,
        height: props.floatingLabelText ? 72 : 48,
        display: 'inline-block',
        position: 'relative',
        fontFamily: 'Roboto+Condensed, sans-serif',
        transition: Transitions.easeOut('200ms', 'height'),
      },
    }

    return styles;
  }

  onBlurEvent = (e) => {
    this.setState({focused: false});
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  };

  onFocusEvent = (e) => {
    this.setState({focused: true});
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  };

  render() {

    let {
      errorText,
      addLabelText,
      allowCreate,
      asyncOptions,
      autoload,
      backspaceRemoves,
      cacheAsyncResults,
      className,
      clearAllText,
      clearValueText,
      clearable,
      delimiter,
      disabled,
      filterOption,
      filterOptions,
      floatingLabelText,
      ignoreCase,
      inputProps,
      isLoading,
      labelKey,
      matchPos,
      matchProp,
      multi,
      name,
      newOptionCreator,
      noResultsText,
      onBlur,
      onChange,
      onFocus,
      onInputChange,
      onOptionLabelClick,
      optionComponent,
      optionRenderer,
      options,
      searchable,
      searchingText,
      searchPromptText,
      singleValueComponent,
      value,
      valueComponent,
      valueKey,
      valueRenderer,
      ...other,
      } = this.props;

    let styles = this.getStyles();
    let selectClassName = "StyledSelect";
    if (this.state.focused) {selectClassName += " is-focused";}
    if (errorText) {selectClassName += " is-error";}
    if (multi) {selectClassName += " is-multi";}

    return (
        <div className={selectClassName} style={MaterialStyles.mergeAndPrefix(styles.root, this.props.style)}>
          <input className="rowAligner" type="text" style={{width: '100%', height: '100%', visibility: 'hidden'}} />
          <Select ref="select" onFocus={this.onFocusEvent} onBlur={this.onBlurEvent}
            name={name}
            valueRenderer={valueRenderer}
            value={value}
            options={options}
            onChange={onChange}
            clearable={clearable}
            searchable={searchable}
            multi={multi}
            delimiter={delimiter}
            placeholder={floatingLabelText}
            disabled={disabled}
            matchProp="label"
          />
          <hr className="underscore-grey"  />
          <hr className="underscore-blue"  />
          <div className="errorText">{errorText}</div>
        </div>
    )
  }


}
