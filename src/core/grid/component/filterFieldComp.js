import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {TextField, Checkbox} from 'material-ui';
import { connect } from 'react-redux'

import MdField from 'core/metamodel/mdField';
import StyledSelect from 'core/components/styledSelect/styledSelect';
import {styleSmall, styleTextFieldSmall} from 'core/form/createForm';

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
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

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
    console.log('onChangeMultiSelect: ', newValue);
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
      return (
        <StyledSelect {...styleSmall} name={name}  value={value} multi={multi} options={fieldOptions} onChange={this.onChangeSelect}  fullWidth={true} clearable={false} disabled={disabled}/>
      );
    } else {
      if (!field.dataType) throw 'Field ' + field.fieldKey + ' has no valueSource nor a dataType';

      switch (field.dataType) {
        case 'NUMBER':
          return (
            <TextField {...styleSmall} value={value} hintText={label} onChange={this.onChangeText} fullWidth={true} disabled={disabled}/>
          );
        case 'STRING':
          return (
            <TextField {...styleSmall} {...styleTextFieldSmall} value={value} hintText={label} onChange={this.onChangeText} fullWidth={true} disabled={disabled}/>
          );
        case 'DATE':
          return (
            <TextField {...styleSmall} {...styleTextFieldSmall} value={value} hintText={label} onChange={this.onChangeText} fullWidth={true} disabled={disabled} />
          );
        case 'DATETIME':
          return (
            <TextField {...styleSmall} {...styleTextFieldSmall} value={value} hintText={label} onChange={this.onChangeText} fullWidth={true} disabled={disabled} />
          );
        default :
              return null;
      }
    }
  }


}


