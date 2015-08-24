import React from 'react';
import {addons} from 'react/addons';
import reactMixin from 'react-mixin';
import Router from 'react-router';
import {TextField, RaisedButton} from 'material-ui';
import { Alert } from 'react-bootstrap';

import SecurityService from 'core/security/securityService';
import CurrentUserActions from 'core/security/currentUserActions';
import CurrentUserStore from 'core/security/currentUserStore';


export default class LoginPage extends React.Component {

  state = {
    user: '',
    password: '',
    errorMessage: null,
    userError: null,
    passwordError: null
  };



  /* *******   EVENT HENDLERS ************ */

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


    SecurityService.login(this.state.user, this.state.password)
    .then((response) => {
        CurrentUserActions.updateCurrentUser(response.data);
        let ral = CurrentUserStore.getRedirectAfterLogin();
        this.transitionTo( (ral && ral !== '/') ? ral : 'home' );
      }, (err) => {
        console.log('login error - ' + err.message, err);
        // po neuspesnem loginu vynulujeme policka a chybove hlasky a nastavime focus na user (v callbacku, protoze az po rerender after setState()
        this.setState({errorMessage: "Bad username or password", user: '', password: '', userError: null, passwordError: null}, () => {
          React.findDOMNode(this.refs.userField).getElementsByTagName("input")[0].focus();
        });

      });
  }



  /* *******   REACT METHODS ************ */

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

    return (
      <form>
        <div className="container-fluid" style={topComponent}>

          {this.state.errorMessage ? errorMessage : ''}

          <div className="row">
            <div className="col-xs-offset-1 col-xs-10">
              <h4>Please login</h4>
            </div>
          </div>



          <div className="row">
            <div className="col-xs-offset-1 col-xs-10 col-sm-4">
              <TextField valueLink={this.linkState('user')} hintText="username" errorText={this.state.userError} ref="userField" autoFocus fullWidth/>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-offset-1 col-xs-10 col-sm-4">
              <TextField type="password" valueLink={this.linkState('password')} hintText="password" errorText={this.state.passwordError} fullWidth/>
            </div>
          </div>
          <div className="row" style={{marginTop:20}}>
            <div className="col-xs-offset-1 col-xs-10 col-sm-4">
              <RaisedButton type="submit" onClick={this.submit} label="Login" primary={true} />
            </div>
          </div>

        </div>

      </form>
    );
  }

}

reactMixin.onClass(LoginPage, React.addons.LinkedStateMixin);
reactMixin.onClass(LoginPage, Router.Navigation);


