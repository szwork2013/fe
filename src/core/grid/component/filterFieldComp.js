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
    multi: React.PropTypes.bool
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
      if (entity && entity.lovItems) {
        fieldOptions = entity.lovItems.map(li => {return {value: li.id, label: li.label};});
      }
    }
    return {fieldOptions};
  }


  state = {
  };

  componentWillReceiveProps (nextProps) {
    let field = nextProps.field;
    if (field.valueSource) {
      MdEntityService.fetchEntities([field.valueSource], {}, [true]);
    }
  }



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
        let concatedValue = value.join('|');
        return (
          <Select name={name} value={concatedValue} multi={true} delimiter="|" options={fieldOptions}/>
        );
      } else {
        return (
          <Select name={name} value={value} options={fieldOptions}/>
        );
      }

    } else {
      if (!field.dataType) throw 'Field ' + field.fieldKey + ' has no valueSource nor a dataType';

      switch (field.dataType) {
        case 'NUMBER':
          return (
            <TextField value={value} hintText={label}/>
          );
        case 'STRING':
          return (
            <TextField value={value} hintText={label}/>
          );
        case 'DATE':
          return (
            <TextField value={value} hintText={label}/>
          );
        case 'DATETIM':
          return (
            <TextField value={value} hintText={label}/>
          );
        default :
              return '';
      }
    }
  }


}


