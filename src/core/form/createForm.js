import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {get, set} from 'lodash';

import Form from 'core/form/form';


export const styleBig = {
  style: {},
  floatingLabelStyle: {}
};

export const styleSmall = {
  style: {
    fontSize: 14,
    height: 54
  },
  floatingLabelStyle: {
    marginBottom: 0,
    top: 'initial',
    bottom: 12}
};

export const styleTextFieldSmall = {
  hintStyle: {lineHeight: 24},
  inputStyle: {marginTop: 0, paddingTop: 12},
  errorStyle: {top: -4}  // lepsi by bylo nastavit bottom, jenze v kodu TextField se bottom nastavuje natvrdo na fontSize + 3 = 15px, takze nastavime top a vyuzijme toho ze "When both top and bottom are specified, the top property takes precedence and the bottom property is ignored."
};

export const styleTextFieldBig = {
};


export default function createForm(definition, FormComponent) {


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
      //console.log('%c %s constructor', 'background-color: magenta', definition.formName);
    }


    validate = () => {
      let {dataObject, rootObject, setDataAction} = this.props;
      let form = Form.safeGet(dataObject, definition.formName);

      let res = form.validateForm(dataObject);
      if (!res) {
        setDataAction(rootObject, 'createForm#validate()');
      }

      return res;
    };

    componentWillMount() {
      let {dataObject, rootObject, setDataAction} = this.props;
      //console.log('%c %s componentWillMount', 'background-color: magenta', definition.formName);
      let fields = this._setupFields(this.props);

      let form = Form.safeGet(dataObject, definition.formName);
      Object.assign(form, {fields, open: dataObject.$new, onCommit: definition.onCommit});

      this._updateFieldsValue(dataObject);

      setDataAction(rootObject, 'createForm(' + FormComponent.name + ')#componentWillMount()');
    }

    componentWillReceiveProps(nextProps) {
      let {dataObject} = nextProps;
      //console.log('%c %s componentWillReceiveProps', 'background-color: magenta', definition.formName);

      let form = Form.safeGet(dataObject, definition.formName);
      if (!form.fields) {
        let fields = this._setupFields(nextProps);
        Object.assign(form, {fields, open: dataObject.$new, onCommit: definition.onCommit});
      }

      this._updateFieldsValue(dataObject);
    }

    render() {
      return <FormComponent {...this.props} formName={definition.formName} validate={this.validate} />;
    }

    _updateFieldsValue(dataObject) {
      let fields = dataObject.$forms[definition.formName].fields;

      // nastaveni value
      for(let field of Object.values(fields)) {
        field.props[(field.mdField.dataType === 'BOOLEAN') ? 'checked' : 'value'] = this.getValue(dataObject, field);
      }
    }

    _setupFields(props) {

      const fields = definition.fields.reduce((acc, fieldDef) => {
        //console.debug('createForm: field: %o on entity %o', field, entity);
        const mdField = props.entity.fields[fieldDef.name];
        const styleDef = (fieldDef.big)? styleBig : styleSmall;
        const styleTextFieldDef = (fieldDef.big)? styleTextFieldBig : styleTextFieldSmall;

        const fieldObject = {
          name: fieldDef.name,
          fieldPath: fieldDef.fieldPath,
          textLabel: mdField.label,
          mdField: mdField,
          validators: fieldDef.validators
        };

        const propsObject = {
          $fieldObject: fieldObject,
          fullWidth: true,
          name: fieldDef.name,
          style: Object.assign({}, styleDef.style, fieldDef.style),
          get errorText() {
            return this.$fieldObject.showValidation && this.$fieldObject.errorMessage
          }
        };

        fieldObject.props = propsObject;

        // tucne a hvezdicka pro povinne
        let editLabel = mdField.label;
        let floatingLabelStyle = Object.assign({}, styleDef.floatingLabelStyle);
        if (fieldObject.validators && fieldObject.validators.includes('IsRequired')) {
          editLabel = editLabel + " *";
          floatingLabelStyle.fontWeight = 'bold';
        }

        switch (mdField.dataType) {
          case 'BOOLEAN':
            propsObject.onCheck = (evt) => {
              this.setValue(this.props.dataObject, fieldDef, evt.target.checked);
              this.props.setDataAction(this.props.rootObject, 'createForm field ' + fieldDef.name + ' onCheck()');
            };
            propsObject.label = editLabel;
            break;
          default:
            propsObject.onChange = (evt) => {
              let value = (evt != null && evt.target) ? evt.target.value : evt;
              this.setValue(this.props.dataObject, fieldDef, value);
              this.props.setDataAction(this.props.rootObject, 'createForm field ' + fieldDef.name + ' onChange()');
            };
            propsObject.floatingLabelText = editLabel;
        }

        if (mdField.maxLength != null) {
          propsObject.maxLength = mdField.maxLength;
        }


        if (mdField.hasLocalValueSource()) {
          let valueSourceEntity =  props.entities.get(mdField.valueSource);
          if (valueSourceEntity) {
            propsObject.options = [{value: null, label: '---'}, ...valueSourceEntity.lovItems];
          }
          propsObject.clearable = false;
          propsObject.searchable = (valueSourceEntity.lovItems.length > 8);
        }

        // Field overrides
        propsObject.floatingLabelStyle = floatingLabelStyle;


        // TextField style overrides (zmenseni)
        // dame to ted na vsechny jine nez StyledSelect, mozna budeme dale vyhazovat
        if (!mdField.valueSourceType) {
          Object.assign(propsObject, styleTextFieldDef);
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
              fieldObject.errorMessage = error; //`Invalid (rule: ${rule}, error: ${error})`
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



        acc[fieldDef.name] = fieldObject;
        return acc;
      }, {});

     return fields;
    }

  };

}

