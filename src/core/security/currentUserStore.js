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
      currentUser: null
    };

  }

  static isLoggedIn() {
    return (this.state.currentUser);
  }


  @bind(actions.updateCurrentUser)
  updateCurrentUser(currentUser) {
    this.setState({ currentUser });
  }

  @bind(actions.login)
  login(currentUser) {
    this.setState({ currentUser });
  }


  @bind(actions.logout)
  dropCurrentUser() {
    this.setState({ currentUser: null });
  }

}

export default CurrentUserStore;
