import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import SecurityService from 'core/security/securityService';
import * as securityActions from 'core/security/securityActions';
import { LoginForm, LoginFormRecord } from 'core/security/loginForm';
import * as favicon from 'core/common/utils/favicon';


function mapStateToProps(state) {
  return {
    loginFormData: state.getIn(['security', 'loginFormData']),
    redirectAfterLogin: state.getIn(['security', 'redirectAfterLogin'])
  };
}


@connect(mapStateToProps, securityActions)
export default class LoginPage extends React.Component {
  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

  static title = 'Zauzoo Login';
  static icon = 'lock';

  static contextTypes = {
    router: PropTypes.func.isRequired
  };


  onSubmit = (e, usernameFieldRef) => {
    console.log('form submited');
    e.preventDefault();

    const {
      loginFormData,
      redirectAfterLogin,
      setLoginFormDataAction,
      setCurrentUserAction,
      } = this.props;

    // form validation
    try {
      loginFormData.validate();

      return SecurityService.login(loginFormData.username.value, loginFormData.password.value, loginFormData.tenant.value)
        .then((response) => {
          setCurrentUserAction(response.data);
          this.context.router.transitionTo((redirectAfterLogin && redirectAfterLogin !== '/') ? redirectAfterLogin : 'home');
        }, (err) => {
          console.log('login error: ' +  err.status + " - " + err.statusText);
          // po neuspesnem loginu vynulujeme policka a chybove hlasky a nastavime focus na user (v callbacku, protoze az po rerender after setState()
          setLoginFormDataAction(new LoginFormRecord({errorMessage: "Bad username or password"}));

          ReactDOM.findDOMNode(usernameFieldRef).getElementsByTagName("input")[0].focus();

        });

    } catch(formWithErrors) {
      setLoginFormDataAction(formWithErrors);
    }

  };


  componentDidMount() {
    favicon.handleFavicon(LoginPage);
  }

  render() {
    return (
        <main className="main-content">
          <LoginForm {...this.props} onSubmit={this.onSubmit}  />
        </main>
    );
  }
}

