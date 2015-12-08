import React from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';


export default function createForm(definition, FormComponent) {

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
        fields[field.name] = {
          hintText: entity.fields[field.name].label,
          errorText: null,
          value: dataObject[field.name],
          onChange: (evt) => {
            console.log('Form ' + definition.form + " onChange event on " + field.name + ", value = " + evt.target.value);
            dataObject[field.name] = evt.target.value;
            setDataAction(dataObject);
          }
        };
        return fields;
      }, {});
    }

    //componentDidMount() {
    //  this.setState({ data: 'Hello' });
    //}
    render() {
      return <FormComponent fields={this.fields} {...this.props} />;
    }
  };


}

