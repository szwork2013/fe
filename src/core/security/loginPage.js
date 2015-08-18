import React from 'react';
import {addons} from 'react/addons';
import reactMixin from 'react-mixin';
import Router from 'react-router';
import SecurityService from 'core/security/securityService';
import CurrentUserActions from 'core/security/currentUserActions';


export default class LoginPage extends React.Component {

  state = {
    user: '',
    password: ''
  };


  submit = (e) => {
    //this.setState({showOptionsModal: true});
    console.log('form submited');
    e.preventDefault();
    // Here, we call an external AuthService. We’ll create it in the next step
    SecurityService.login(this.state.user, this.state.password)
    .then((response) => {
        CurrentUserActions.updateCurrentUser(response.data);
        this.transitionTo('home');
      }, (err) => {
        console.log('login error');
      });
  }


  render() {

    return (
      <div>
        <h1>
          LOGIN PAGE
        </h1>
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


