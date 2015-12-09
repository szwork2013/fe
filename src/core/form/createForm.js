import React from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import {store} from 'core/common/redux/store';


export default function createForm(definition, FormComponent) {

  const defaultStyle = {
    fontSize: 14
  };

  return class extends React.Component {
    shouldComponentUpdate = shouldPureComponentUpdate;

    static propTypes = {
      dataObject: React.PropTypes.object.isRequired,
      entity: React.PropTypes.object.isRequired,
      setDataAction: React.PropTypes.func.isRequired
    };

    constructor(props) {
      super(props);
      const {dataObject, entity, setDataAction} = props;

      this.fields = definition.fields.reduce((fields, field) => {
        const mdField = entity.fields[field.name];
        const fieldObject = {
          floatingLabelText: mdField.label,
          errorText: null,
          name: field.name,
          onChange: (evt) => {
            let value = (typeof evt === 'object' && evt.target) ? evt.target.value : evt;
            console.log('Form ' + definition.form + " onChange event on " + field.name + ", value = " + value);
            dataObject[field.name] = value;
            setDataAction(dataObject);
          },
          style: Object.assign({}, defaultStyle, field.style)
        };

        if (mdField.hasLocalValueSource()) {
          let valueSourceEntity =  store.getState().getIn(['metamodel', 'entities', mdField.valueSource]);
          if (valueSourceEntity) {
            fieldObject.options = [{value: '', label: '---'}, ...valueSourceEntity.lovItems];
          }
          fieldObject.clearable = false;
          fieldObject.searchable = (valueSourceEntity.lovItems.length > 8);

        }

        fields[field.name] = fieldObject;
        return fields;
      }, {});
    }

    //componentDidMount() {
    //  this.setState({ data: 'Hello' });
    //}
    render() {

      // nastaveni value
      for(let fieldName in this.fields) {
        this.fields[fieldName].value = this.props.dataObject[fieldName];
      }

      console.log("dataObject = ", this.props.dataObject);
      console.log("fields = ", this.fields);

      return <FormComponent fields={this.fields} {...this.props} />;
    }
  };


}

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
