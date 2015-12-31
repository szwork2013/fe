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

    setValue(dataObject, field, value) {
      if (field.fieldPath) {
        set(dataObject, field.fieldPath, value);
      } else {
        dataObject[field.name] = value;
      }
    }

    getValue(dataObject, field) {
      if (field.fieldPath) {
        return get(dataObject, field.fieldPath);
      } else {
        return dataObject[field.name];
      }
    }

    constructor(props) {
      super(props);
    }

    allValid() {
      let fields = this.props.dataObject.$forms[definition.formName].fields;
      // nastaveni value
      for(let field of Object.values(fields)) {
        if (field.valid === false) return false
      }
      return true;
    }

    showAllValidations() {
      let fields = this.props.dataObject.$forms[definition.formName].fields;
      // nastaveni value
      for(let field of Object.values(fields)) {
        field.showValidation = true;
      }
      this.props.setDataAction(this.props.rootObject, 'createForm#showAllValidations()');
    }

    validate = () => {
      let res = this.allValid();
      if (!res) {
        this.showAllValidations();
        return false;
      } else {
        return true;
      }
    }

    componentWillMount() {
      let {dataObject, rootObject, setDataAction} = this.props;
      let fields = this._setupFields(this.props);

      if (!dataObject.$forms) dataObject.$forms = {};
      if (!dataObject.$forms[definition.formName]) dataObject.$forms[definition.formName] = {};
      dataObject.$forms[definition.formName].fields = fields;

      this._updateFieldsValue(dataObject);

      setDataAction(rootObject, 'createForm#componentWillMount()');
    }

    componentWillReceiveProps(nextProps) {
      this._updateFieldsValue(nextProps.dataObject);
    }

    render() {
      return <FormComponent {...this.props} validate={this.validate} />;
    }

    _updateFieldsValue(dataObject) {
      let fields = dataObject.$forms[definition.formName].fields;

      // nastaveni value
      for(let field of Object.values(fields)) {
        field.props[(field.mdField.dataType === 'BOOLEAN') ? 'checked' : 'value'] = this.getValue(dataObject, field);
      }
    }

    _setupFields(props) {

      const fields = definition.fields.reduce((acc, field) => {
        //console.debug('createForm: field: %o on entity %o', field, entity);
        const mdField = props.entity.fields[field.name];

        const fieldObject = {
          name: field.name,
          fieldPath: field.fieldPath,
          textLabel: mdField.label,
          mdField: mdField,
          validators: field.validators
        };

        const propsObject = {
          $fieldObject: fieldObject,
          fullWidth: true,
          name: field.name,
          style: Object.assign({}, defaultStyle, field.style),
          get errorText() {
            return this.$fieldObject.showValidation && this.$fieldObject.errorMessage
          }
        };

        fieldObject.props = propsObject;


        switch (mdField.dataType) {
          case 'BOOLEAN':
            propsObject.onCheck = (evt) => {
              this.setValue(this.props.dataObject, field, evt.target.checked);
              this.props.setDataAction(this.props.rootObject, 'createForm field ' + field.name + ' onCheck()');
            };
            propsObject.label = mdField.label;
            break;
          default:
            propsObject.onChange = (evt) => {
              let value = (evt != null && evt.target) ? evt.target.value : evt;
              this.setValue(this.props.dataObject, field, value);
              this.props.setDataAction(this.props.rootObject, 'createForm field ' + field.name + ' onChange()');
            };
            propsObject.floatingLabelText = mdField.label;
        }


        if (mdField.hasLocalValueSource()) {
          let valueSourceEntity =  props.entities.get(mdField.valueSource);
          if (valueSourceEntity) {
            propsObject.options = [{value: '', label: '---'}, ...valueSourceEntity.lovItems];
          }
          propsObject.clearable = false;
          propsObject.searchable = (valueSourceEntity.lovItems.length > 8);
        }

        // TextField style overrides (zmenseni)
        // dame to ted na vsechny jine nez StyledSelect, mozna budeme dale vyhazovat
        if (!mdField.valueSourceType) {
          propsObject.hintStyle = {lineHeight: 24};
          propsObject.floatingLabelStyle = {marginBottom: 0, top: 'initial', bottom: 12};
          propsObject.inputStyle = {marginTop: 0, paddingTop: 6};
          propsObject.errorStyle = {top: -4};  // lepsi by bylo nastavit bottom, jenze v kodu TextField se bottom nastavuje natvrdo na fontSize + 3 = 15px, takze nastavime top a vyuzijme toho ze "When both top and bottom are specified, the top property takes precedence and the bottom property is ignored."
        }

        propsObject.onBlur = (evt) => {
          fieldObject.showValidation = true;
          this.props.setDataAction(this.props.rootObject, 'createForm field ' + fieldObject.name + ' onBlur()');
        };


        fieldObject.handleValidation = ({validationResult, showValidation}) => {
          console.log("%c field = %s, validationResult = %O, showValidation = %s", 'background-color: lightblue', fieldObject.name, validationResult, showValidation);
          let {showValidation: show, valid} = fieldObject;

          if (validationResult != null) {
            valid = validationResult.valid;
            let {error, rule} = validationResult;
            if (valid === false) {
              fieldObject.errorMessage = `Invalid (rule: ${rule}, error: ${error})`
            } else {
              fieldObject.errorMessage = null;
            }
          }

          show = showValidation != null ? showValidation : show;

          fieldObject.showValidation = show;
          fieldObject.valid = valid;

          if (valid != null) {
            this.props.setDataAction(this.props.rootObject, 'createForm field ' + fieldObject.name + ' handleValidation()');
          }
        };



        acc[field.name] = fieldObject;
        return acc;
      }, {});

     return fields;
    }

  };

}

