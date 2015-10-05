import React from 'react';
import Select from 'react-select';

import styles from 'core/components/styledSelect/styledSelect.less';


export default class StyledSelect extends React.Component {

  static propTypes = {
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
    placeholder: React.PropTypes.string,       // field placeholder, displayed when there's no value
    searchable: React.PropTypes.bool,          // whether to enable searching feature or not
    searchingText: React.PropTypes.string,     // message to display whilst options are loading via asyncOptions
    searchPromptText: React.PropTypes.string,  // label to prompt for search input
    singleValueComponent: React.PropTypes.func,// single value component when multiple is set to false
    value: React.PropTypes.any,                // initial field value
    valueComponent: React.PropTypes.func,      // value component to render in multiple mode
    valueKey: React.PropTypes.string,          // path of the label value in option objects
    valueRenderer: React.PropTypes.func        // valueRenderer: function (option) {}
  };

  render() {

    let {
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
      placeholder,
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

    let selectValueRenderer = (selectValue) => {
      return (
        <div style={{width: '100%'}}>
          <div style={{paddingRight: '52px'}}>{valueRenderer?valueRenderer(selectValue):selectValue.label}</div>
          <hr className="underscore" style={{
            borderStyle: 'none none solid',
              borderBottomWidth: '2px',
              position: 'absolute',
              width: '100%',
              bottom: '6px',
              margin: '0px',
              boxSizing: 'content-box',
              height: '0px',
              borderColor: 'rgb(63, 81, 181)',
              transform: 'scaleX(0)',
              transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'}} />
      </div>
      )
    }

    return (
        <div className="StyledSelect" style={{position: 'relative', paddingBottom: '1px'}}>
          <Select
            name={name}
            valueRenderer={selectValueRenderer}
            value={value}
            options={options}
            onChange={onChange}
            clearable={clearable}
          />
          <hr style={{
            display: 'inline-block',
            border: 'none',
            borderBottom: 'solid 1px #e0e0e0',
            position: 'absolute',
            width: '100%',
            bottom: '6px',
            margin: 0,
            boxSizing: 'content-box',
            height: 0,
            marginRight: '5px'}} />
        </div>
    )
  }


}
