import React from 'react';
import CurrentUserStore from 'core/security/currentUserStore';
import CurrentUserActions from 'core/security/currentUserActions';
import SecurityService from 'core/security/securityService';
import CommonService from 'core/common/service/commonService';
import * as favicon from 'core/common/utils/favicon';

export default class PageAncestor extends React.Component {



  static willTransitionTo(transition, params, query, callback) {
    console.log('willTransitionTo: transition = %o, params = %o, query = %o', transition.path + ' ' + transition.abortReason, params, query);

    // check if autenticated
    if (!CurrentUserStore.isLoggedIn()) {

      SecurityService.getCurrentUser()
        .then((currentUser) => {

          if (currentUser) {
            CurrentUserActions.updateCurrentUser(currentUser);
            CommonService.emitter.emit('loadEnd');
            favicon.handleFavicon(this.handler);
          } else {
            CurrentUserActions.updateRedirectAfterLogin(transition.path);
            transition.redirect('loginPage');
          }

          callback();

        }, (error) => {
          transition.redirect('errorPage');
          callback();
        });
      return;
    }
    favicon.handleFavicon(this.handler);
    callback();
  }

  static willTransitionFrom(transition, component) {
    console.log('willTransitionFrom: transition = %o, component = %o, query = %o', transition, component);
    favicon.removeFaviconLink();
  }


}


