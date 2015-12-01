import {Record} from 'immutable';

export class FieldRecord extends Record({
  value: null,
  lovItems: null,
  errorText: null
}) {

  setValue(value) {
    return this.set('value', value);
  }

  setLovItems(lovItems) {
    return this.set('lovItems', lovItems);
  }

  setErrorText(errorText) {
    return this.set('errorText', errorText);
  }

}


export function enhanceFormRecord(formRecordClass) {

  formRecordClass.prototype.setFieldValue = function(fieldName, value, resetErrorText) {
    let field = this.get(fieldName);
    let newField = field.setValue(value);
    if (resetErrorText) newField = newField.setErrorText(null);
    return this.set(fieldName, newField);
  };

  formRecordClass.prototype.setFieldLovItems = function(fieldName, lovItems) {
    let field = this.get(fieldName);
    return this.set(fieldName, field.setLovItems(lovItems));
  };

  formRecordClass.prototype.setFieldErrorText = function(fieldName, errorText) {
    let field = this.get(fieldName);
    return this.set(fieldName, field.setErrorText(errorText));
  };

}
