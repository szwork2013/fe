import alt from 'core/common/config/alt-config';
import {createStore, bind} from 'alt/utils/decorators';
import actions from 'core/security/currentUserActions';

@createStore(alt)
class CurrentUserStore {

  constructor() {
    console.log('CurrentUserStore constructor');
    this.on('init', () => {
      console.log('CurrentUserStore init');
    });

    this.state = {
      currentUser: null,
      redirectAfterLogin: null
    };

  }

  static isLoggedIn() {
    return (this.getState().currentUser);
  }

  static getRedirectAfterLogin() {
    return this.getState().redirectAfterLogin;
  }


  @bind(actions.updateCurrentUser)
  updateCurrentUser(currentUser) {
    this.setState({ currentUser });
  }

  @bind(actions.updateRedirectAfterLogin)
  updateRedirectAfterLogin(redirectAfterLogin) {
    this.setState({ redirectAfterLogin });
  }


}

export default CurrentUserStore;
