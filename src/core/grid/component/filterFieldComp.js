import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import {TextField, Checkbox} from 'material-ui';
import { connect } from 'react-redux'

import MdField from 'core/metamodel/mdField';
import StyledSelect from 'core/components/styledSelect/styledSelect';


function mapStateToProps(state, ownProps ) {
  let fieldOptions;

  let {field} = ownProps;

  if (field.hasLocalValueSource()) {
    let entity =  state.getIn(['metamodel', 'entities', field.valueSource]);
    if (entity) {
      fieldOptions = entity.lovItems;
    }
  }
  return {fieldOptions};
}


@connect(mapStateToProps)
export default class FilterFieldComp extends React.Component {

  static propTypes = {
    name: React.PropTypes.string.isRequired,
    field: React.PropTypes.instanceOf(MdField).isRequired,
    value: React.PropTypes.any,
    label: React.PropTypes.string,
    multi: React.PropTypes.bool,
    onChange: React.PropTypes.func.isRequired,
    disabled: React.PropTypes.bool
  };



  onChangeText = (e) => {
    this.props.onChange(e.target.value);
  };

  onChangeMultiSelect = (newValue, newValuesArray) => {
    //this.props.onChange(newValuesArray);
    this.props.onChange(newValue.split('|'));
  };
  onChangeSelect = (newValue) => {
    this.props.onChange(newValue);
  };

  render() {

    let {
      name,
      field,
      value,
      label,
      fieldOptions,
      multi,
      disabled,
      ...other,
      } = this.props;

    if (field.valueSource) {

      if (multi) {
        return (
          <StyledSelect name={name}  value={value} multi={true} delimiter="|" options={fieldOptions}
                  onChange={this.onChangeMultiSelect}  clearable={false} disabled={disabled}/>
        );
      } else {
        return (
          <StyledSelect name={name} value={value} options={fieldOptions} onChange={this.onChangeSelect}  clearable={false} disabled={disabled}/>
        );
      }

    } else {
      if (!field.dataType) throw 'Field ' + field.fieldKey + ' has no valueSource nor a dataType';

      switch (field.dataType) {
        case 'NUMBER':
          return (
            <TextField value={value} hintText={label} onChange={this.onChangeText} disabled={disabled}/>
          );
        case 'STRING':
          return (
            <TextField value={value} hintText={label} onChange={this.onChangeText} disabled={disabled}/>
          );
        case 'DATE':
          return (
            <TextField value={value} hintText={label} onChange={this.onChangeText} disabled={disabled} />
          );
        case 'DATETIME':
          return (
            <TextField value={value} hintText={label} onChange={this.onChangeText} disabled={disabled} />
          );
        default :
              return null;
      }
    }
  }


}


