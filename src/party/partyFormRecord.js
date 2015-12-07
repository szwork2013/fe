import {Record, List} from 'immutable';

import {FieldRecord, enhanceFormRecord} from 'core/form/fieldRecord';


export class PartyFormRecord extends Record({
  username: new FieldRecord(),
  password: new FieldRecord(),
  tenantId: new FieldRecord({lovItems: []}),
  errorMessage: null
}) {


  validate() {
    let form = this;
    let isError = false;

    if (!form.username.value) {
      form = form.setFieldErrorText('username', "This Field is required.");
      isError = true;
    }
    if (!form.password.value) {
      form = form.setFieldErrorText('password', "This Field is required.");
      isError = true;
    }

    if (form.tenantId.value == null) {
      form = form.setFieldErrorText('tenantId', "This Field is required.");
      isError = true;
    }

    if (isError) throw (form);
  }

}
enhanceFormRecord(PartyFormRecord);
