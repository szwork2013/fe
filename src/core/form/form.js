

export default class Form {

  static safeGet(dataObject, formName) {
    if (!dataObject.$forms) {
      dataObject.$forms = {};
    }

    let form = dataObject.$forms[formName];

    if (!form) {
      form = new Form(formName);
      dataObject.$forms[formName] = form;
    }

    return form;
  }

  constructor (formName) {

    this.formName = formName;

    this.fields;

    this.open;

    this.onCommit;

  }

  isFormValid() {
    for(let field of Object.values(this.fields)) {
      if (field.valid === false) return false
    }
    return true;
  }

  showAllValidations() {
    for(let field of Object.values(this.fields)) {
      field.showValidation = true;
    }
  }

  validateForm(dataObject) {
    let res = this.isFormValid();
    if (!res) {
      this.showAllValidations();
      return false;
    } else {
      if (this.onCommit) {
        this.onCommit(dataObject);
      }
      return true;
    }
  };


}
