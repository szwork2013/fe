import React from 'react';
import reactMixin from 'react-mixin';
import Router from 'react-router';
import {TextField, RaisedButton, SelectField} from 'material-ui';
import { Alert } from 'react-bootstrap';

import SecurityService from 'core/security/securityService';
import CurrentUserActions from 'core/security/currentUserActions';
import CurrentUserStore from 'core/security/currentUserStore';
import * as favicon from 'core/common/utils/favicon';

export default class LoginPage extends React.Component {

  static title = 'Zauzoo Login';
  static icon = 'lock';

  state = {
    user: '',
    password: '',
    errorMessage: null,
    userError: null,
    passwordError: null,
    tenants: [],
    tenantId: null
  };




  /* *******   EVENT HENDLERS ************ */

  onChangeUsername = (e) => {
    this.setState({user: e.target.value});

    SecurityService.getTenants(e.target.value)
      .then(data => {
        this.setState({
          tenants: data,
          tenantId: (data.length > 0) ? data[0].id : null
        });
      });
  };

  onChangeTenantId = (e) => {
    this.setState({tenantId: e.target.value});
  };


  submit = (e) => {

    console.log('form submited');
    e.preventDefault();

    // form validation
    if (!this.state.user) {
      this.setState({userError: "This Field is required."});
    }
    if (!this.state.password) {
      this.setState({passwordError: "This Field is required."});
    }

    if (!this.state.user || !this.state.password) {
      return;
    }


    SecurityService.login(this.state.user, this.state.password, this.state.tenantId)
      .then((response) => {
        CurrentUserActions.updateCurrentUser(response.data);
        let ral = CurrentUserStore.getRedirectAfterLogin();
        this.transitionTo((ral && ral !== '/') ? ral : 'home');
      }, (err) => {
        console.log('login error - ' + err.message, err);
        // po neuspesnem loginu vynulujeme policka a chybove hlasky a nastavime focus na user (v callbacku, protoze az po rerender after setState()
        this.setState({
          errorMessage: "Bad username or password",
          user: '',
          password: '',
          userError: null,
          passwordError: null
        }, () => {
          React.findDOMNode(this.refs.userField).getElementsByTagName("input")[0].focus();
        });

      });
  };


  /* *******   REACT METHODS ************ */

  componentDidMount() {
    favicon.handleFavicon(LoginPage);
  }

  render() {

    var topComponent = {
      marginTop: 40
    };

    var errorMessage = (
      <div className="row">
        <div className="col-xs-offset-1 col-xs-10">
          <Alert bsStyle='danger'>
            {this.state.errorMessage}
          </Alert>
        </div>
      </div>
    );

    var tenantIdDisabled = (this.state.tenants.length <= 1);


    return (
      <main className="main-content">

      <form>
        <div className="container-fluid" style={topComponent}>

          {this.state.errorMessage ? errorMessage : ''}

          <div className="row">
            <div className="col-xs-offset-1 col-xs-10">
              <h4>Please login</h4>
            </div>
          </div>


          <div className="row">
            <div className="col-xs-offset-1 col-xs-10" style={{display:'flex'}}>
              <TextField value={this.state.user} hintText="username" errorText={this.state.userError} ref="userField"
                         style={{maxWidth:200}}
                         autoFocus fullWidth onChange={this.onChangeUsername} autoComplete="off" tabIndex="1"/>
              <SelectField
                style={{marginLeft:15, maxWidth:200}}
                value={this.state.tenantId} onChange={this.onChangeTenantId} disabled={tenantIdDisabled}
                hintText="Client" fullWidth
                menuItems={this.state.tenants} displayMember="label" valueMember="id" autocomplete="off"/>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-offset-1 col-xs-10">
              <TextField type="password" valueLink={this.linkState('password')} hintText="password"
                         errorText={this.state.passwordError} fullWidth autoComplete="off" tabIndex="3"
                         style={{maxWidth:200}}/>
            </div>
          </div>
          <div className="row" style={{marginTop:20}}>
            <div className="col-xs-offset-1 col-xs-10">
              <RaisedButton type="submit" onClick={this.submit} label="Login" primary={true} tabIndex={4}/>
            </div>
          </div>

        </div>

      </form>
      </main>

    );
  }

}

reactMixin.onClass(LoginPage, React.addons.LinkedStateMixin);
reactMixin.onClass(LoginPage, Router.Navigation);


