import React from 'react';
import {addons} from 'react/addons';
import reactMixin from 'react-mixin';
import Router from 'react-router';
import SecurityService from 'core/security/securityService';
import CurrentUserActions from 'core/security/currentUserActions';
import CurrentUserStore from 'core/security/currentUserStore';


export default class LoginPage extends React.Component {

  state = {
    user: '',
    password: '',
    errorMessage: null
  };


  submit = (e) => {
    //this.setState({showOptionsModal: true});
    console.log('form submited');
    e.preventDefault();
    // Here, we call an external AuthService. We’ll create it in the next step
    SecurityService.login(this.state.user, this.state.password)
    .then((response) => {
        CurrentUserActions.updateCurrentUser(response.data);
        let ral = CurrentUserStore.getRedirectAfterLogin();
        this.transitionTo( (ral && ral !== '/') ? ral : 'home' );
      }, (err) => {
        console.log('login error - ' + err.message, err);
        this.setState({errorMessage: "Bad username or password"});
      });
  }


  render() {

    return (
      <div>
        <h1>
          LOGIN PAGE
        </h1>

        {this.state.errorMessage ? <h3>{this.state.errorMessage}</h3> : ''}

        <input type="text" valueLink={this.linkState('user')} placeholder="user"/>
        <br/>
        <input type="password" valueLink={this.linkState('password')} placeholder="password"/>
        <button type="submit" onClick={this.submit}>Submit</button>
      </div>
    );
  }

}

reactMixin.onClass(LoginPage, React.addons.LinkedStateMixin);
reactMixin.onClass(LoginPage, Router.Navigation);


