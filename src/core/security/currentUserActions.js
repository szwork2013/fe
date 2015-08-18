import alt from 'core/common/config/alt-config';
import {createActions} from 'alt/utils/decorators';

@createActions(alt)
class CurrentUserActions {

  updateCurrentUser(currentUser) {
    return currentUser;
  }

  updateRedirectAfterLogin(redirectAfterLogin) {
    return redirectAfterLogin;
  }


}

export default CurrentUserActions;
