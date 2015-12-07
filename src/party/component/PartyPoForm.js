import React, { PropTypes } from 'react';
import {Record, List} from 'immutable';
import shouldPureComponentUpdate from 'react-pure-render/function';
import {TextField, RaisedButton, SelectField} from 'material-ui';
import {FieldRecord, enhanceFormRecord} from 'core/form/fieldRecord';
import { Alert } from 'react-bootstrap';


export class PartyPoForm extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {

    const {
      partyObject,
      } = this.props;


    return (

      <div className="col-xs-10">


        <div className="row">
          <div className="col-xs-offset-1 col-xs-10" style={{display:'flex'}}>
            <TextField hintText="username" errorText={loginFormData.username.errorText}
                       value={loginFormData.username.value}
                       onChange={(e) => {setLoginFormUsernameAction(e.target.value);}}
                       autoFocus fullWidth autoComplete="off" tabIndex="1" style={{maxWidth:200}}/>
            <SelectField
              style={{marginLeft:15, maxWidth:200}}
              value={loginFormData.tenantId.value}
              onChange={(e) => {setLoginFormDataAction(loginFormData.setFieldValue('tenantId', e.target.value, true));}}
              disabled={loginFormData.isTenantIdDisabled()}
              hintText="Client" fullWidth errorText={loginFormData.tenantId.errorText}
              menuItems={loginFormData.tenantId.lovItems} displayMember="label" valueMember="id" autoComplete="off"/>
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
            <RaisedButton type="submit" label="Login" primary={true} tabIndex={4}/>
          </div>
        </div>

      </div>

    );
  }
}
