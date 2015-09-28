import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import connectToStores from 'alt/utils/connectToStores';

import {TextField, Checkbox} from 'material-ui';
import Select  from 'react-select';

import MdField from 'core/metamodel/mdField';
import MdEntityService from 'core/metamodel/mdEntityService';
import MdEntityStore from 'core/metamodel/mdEntityStore';


@connectToStores
export default class FilterFieldComp extends React.Component {

  static propTypes = {
    name: React.PropTypes.string.isRequired,
    field: React.PropTypes.instanceOf(MdField).isRequired,
    value: React.PropTypes.any.isRequired,
    label: React.PropTypes.string,
    multi: React.PropTypes.bool,
    onChange: React.PropTypes.func.isRequired,
  };

  static getStores(props) {
    return [MdEntityStore];
  }

  // multiple stores @see https://github.com/goatslacker/alt/issues/420
  static getPropsFromStores(props) {
    let valueSource = props.field.valueSource;
    let fieldOptions;

    if (valueSource) {
      let entity = MdEntityStore.getEntity(valueSource);
      if (entity) {
        fieldOptions = entity.lovItems;
      }
    }
    return {fieldOptions};
  }


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
      ...other,
      } = this.props;

    if (field.valueSource) {

      if (multi) {
        return (
          <Select name={name} value={value} multi={true} delimiter="|" options={fieldOptions}
                  onChange={this.onChangeMultiSelect}  clearable={false}/>
        );
      } else {
        return (
          <Select name={name} value={value} options={fieldOptions} onChange={this.onChangeSelect}  clearable={false}/>
        );
      }

    } else {
      if (!field.dataType) throw 'Field ' + field.fieldKey + ' has no valueSource nor a dataType';

      switch (field.dataType) {
        case 'NUMBER':
          return (
            <TextField value={value} hintText={label} onChange={this.onChangeText} />
          );
        case 'STRING':
          return (
            <TextField value={value} hintText={label} onChange={this.onChangeText} />
          );
        case 'DATE':
          return (
            <TextField value={value} hintText={label} onChange={this.onChangeText} />
          );
        case 'DATETIM':
          return (
            <TextField value={value} hintText={label} onChange={this.onChangeText} />
          );
        default :
              return null;
      }
    }
  }


}


