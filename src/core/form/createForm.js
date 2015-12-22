import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {get, set} from 'lodash';


export default function createForm(definition, FormComponent) {

  const defaultStyle = {
    fontSize: 14,
    height: 54
  };

  return class extends React.Component {
    shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    displayName = FormComponent.name;

    static propTypes = {
      dataObject: React.PropTypes.object.isRequired,
      rootObject: React.PropTypes.object.isRequired,
      entity: React.PropTypes.object.isRequired,
      entities: React.PropTypes.object.isRequired,
      setDataAction: React.PropTypes.func.isRequired
    };

    constructor(props) {
      super(props);

      console.log('createForm props: %o', props);

      this.fields = definition.fields.reduce((fields, field) => {
        //console.debug('createForm: field: %o on entity %o', field, entity);
        const mdField = props.entity.fields[field.name];
        const fieldObject = {
          fullWidth: true,
          textLabel: mdField.label,
          errorText: null,
          name: field.name,
          fieldPath: field.fieldPath,
          onChange: (evt) => {
            let value = (typeof evt === 'object' && evt.target) ? evt.target.value : evt;
            //console.log('Form ' + definition.form + " onChange event on " + field.name + ", value = " + value + ", $open = " + this.props.rootObject.$open);

            // uprava pro boolean
            //let value = (mdField.dataType === 'BOOLEAN' && typeof value === 'string') ? JSON.parse(value) : value;

            if (field.fieldPath) {
              set(this.props.dataObject, field.fieldPath, value);
            } else {
              this.props.dataObject[field.name] = value;
            }

            this.props.setDataAction(this.props.rootObject);
          },
          style: Object.assign({}, defaultStyle, field.style)
        };

        if (mdField.hasLocalValueSource()) {
          let valueSourceEntity =  props.entities.get(mdField.valueSource);
          if (valueSourceEntity) {
            fieldObject.options = [{value: '', label: '---'}, ...valueSourceEntity.lovItems];
          }
          fieldObject.clearable = false;
          fieldObject.searchable = (valueSourceEntity.lovItems.length > 8);

        }

        // TextField style overrides (zmenseni)
        // dame to ted na vsechny jine nez StyledSelect, mozna budeme dale vyhazovat
        if (!mdField.valueSourceType) {
          fieldObject.hintStyle = {lineHeight: 24};
          fieldObject.floatingLabelStyle = {marginBottom: 0, top: 'initial', bottom: 12};
          fieldObject.inputStyle = {marginTop: 0, paddingTop: 6};
        }

        // checkbox ma label, ostatni asi floatingLabelText
        if (mdField.dataType === 'BOOLEAN') {
          fieldObject.label = mdField.label;
          //fieldObject.defaultChecked =
        } else {
          fieldObject.floatingLabelText = mdField.label;
        }



        fields[field.name] = fieldObject;
        return fields;
      }, {});
    }

    //componentDidMount() {
    //  this.setState({ data: 'Hello' });
    //}
    render() {

      let dataObject = this.props.dataObject;

      // nastaveni value
      for(let field of Object.values(this.fields)) {
        if (field.fieldPath) {
          field.value = get(dataObject, field.fieldPath);
        } else {
          field.value = dataObject[field.name];
        }
      }


      return <FormComponent fields={this.fields} {...this.props} />;
    }
  };

}

