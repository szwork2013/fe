import React from 'react';
import {addons} from 'react/addons';
import reactMixin from 'react-mixin';
import Router from 'react-router';
import Mui from 'material-ui';

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

    return (
      <form>
        <h1>
          LOGIN PAGE
        </h1>

        {this.state.errorMessage ? <h3>{this.state.errorMessage}</h3> : ''}

        <Mui.TextField valueLink={this.linkState('user')} hintText="username" errorText={this.state.userError} ref="userField" autoFocus/>
        <br/>
        <Mui.TextField type="password" valueLink={this.linkState('password')} hintText="password" errorText={this.state.passwordError} />
        <br/>
        <Mui.RaisedButton type="submit" onClick={this.submit} label="Login" primary={true} />
      </form>
    );
  }

}

reactMixin.onClass(LoginPage, React.addons.LinkedStateMixin);
reactMixin.onClass(LoginPage, Router.Navigation);


