import React, { PropTypes } from 'react';
import {Record, List} from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {TextField, RaisedButton, SelectField, MenuItem} from 'material-ui';
import {FieldRecord, enhanceFormRecord} from 'core/form/fieldRecord';
import { Alert } from 'react-bootstrap';


export class LoginFormRecord extends Record({
  username: new FieldRecord(),
  password: new FieldRecord(),
  tenant: new FieldRecord({lovItems: []}),
  errorMessage: null
}) {

  isTenantDisabled() {
    return (this.tenant.lovItems.length <= 1);
  }

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

    if (form.tenant.value == null) {
      form = form.setFieldErrorText('tenant', "This Field is required.");
      isError = true;
    }

    if (isError) throw (form);
  }

}
enhanceFormRecord(LoginFormRecord);



export class LoginForm extends React.Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

  render() {

    const {
      loginFormData,
      setLoginFormDataAction,
      setLoginFormUsernameAction,
      onSubmit
      } = this.props;


    var errorMessage = (
      <div className="row">
        <div className="col-xs-offset-1 col-xs-10">
          <Alert bsStyle='danger'>
            {loginFormData.errorMessage}
          </Alert>
        </div>
      </div>
    );

    const tenantItems = loginFormData.tenant.lovItems.map( (li,i) => <MenuItem value={li.value} key={li.value} primaryText={li.label}/>);


    return (
      <form onSubmit={ e => onSubmit(e, this.refs.usernameField)} >
        <div className="container-fluid" style={{marginTop: 40}}>

          {loginFormData.errorMessage ? errorMessage : ''}

          <div className="row">
            <div className="col-xs-offset-1 col-xs-10">
              <h4>Please login</h4></div>
          </div>


          <div className="row">
            <div className="col-xs-offset-1 col-xs-10" style={{display:'flex'}}>
              <TextField hintText="username" errorText={loginFormData.username.errorText} ref="usernameField"
                         value={loginFormData.username.value}
                         onChange={(e) => {setLoginFormUsernameAction(e.target.value);}}
                         autoFocus fullWidth autoComplete="off" tabIndex="1" style={{maxWidth:200}}/>
              <SelectField
                style={{marginLeft:15, maxWidth:200}}
                value={loginFormData.tenant.value}
                onChange={(e,key,payload) => {setLoginFormDataAction(loginFormData.setFieldValue('tenant', payload, true));}}
                disabled={loginFormData.isTenantDisabled()}
                hintText="Client" fullWidth errorText={loginFormData.tenant.errorText} autoComplete="off">
                {tenantItems}
                </SelectField>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-offset-1 col-xs-10">
              <TextField type="password" value={loginFormData.password.value} hintText="password"
                         onChange={(e) => {setLoginFormDataAction(loginFormData.setFieldValue('password', e.target.value, true));}}
                         errorText={loginFormData.password.errorText} fullWidth autoComplete="off" tabIndex="3"
                         style={{maxWidth:200}}/>
            </div>
          </div>
          <div className="row" style={{marginTop:20}}>
            <div className="col-xs-offset-1 col-xs-10">
              <RaisedButton type="submit"  label="Login" primary={true} tabIndex={4}/>
            </div>
          </div>

        </div>

      </form>

    );
  }
}
