import React from 'react';
import Axios from 'axios';

import Locales from 'core/common/config/locales';
import commonService from 'core/common/service/commonService';
import CurrentUserActions from 'core/security/currentUserActions';
import {stringify} from 'core/common/utils/jsonUtils';

console.debug('axios init');


// Add a request interceptor
Axios.interceptors.request.use((config) => {
  // Do something before request is sent
  if (!config.headers) config.headers = {};
  Object.assign(config.headers, {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json; charset=UTF-8',
    'Accept': 'application/json',
    'Accept-Language': Locales.lang
  });

  config.transformRequest = [stringify];

  // vyhodim $ properties (obsahuji circular references)
  //removeSystemProperties(config.data);


  if (!config.url.startsWith("/api")) config.url = '/api' + config.url;

  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
Axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response;
}, function (error) {
  // Do something with response error
  console.log('Error %o', error);

  if (error.status == 401) {
    let _r = commonService.router;
    if (_r) {
      CurrentUserActions.updateRedirectAfterLogin(_r.getCurrentPath());
      _r.transitionTo('loginPage');
    }
  } else {
    let _t = commonService.toastr;
    if (_t) {

      let content = 'Error';
      if (error.data) {
        if (typeof error.data === 'string') {
          content = ( <p>{error.data}</p> );
        } else if (error.data.severity) {
          content = (
            <ul>
              { error.data.messages.map((err) => (<li> {err.propertyPath + ' ' + err.message + ( (err.rootBeanClass)? " ( on " + err.rootBeanClass + ')' : '' )} </li>) ) }
            </ul>
          );
        } else {
          content = (<div><p>'{error.data.error}</p>
            <p>
              <pre>{error.data.exception} + ' - ' + {error.data.message}</pre>
            </p>
          </div> );
        }
      } else {
        content = ( <p>{error.statusText}</p> );
      }

      _t.error(
        content,
        "Server error " + error.status, {
          closeButton: true,
          tapToDismiss: false,
          showAnimation: 'animated fadeIn',
          hideAnimation: '',
          //hideDuration: 1000,
          timeOut: 0,
          extendedTimeOut: 0
        });
    } else {
      window.location.replace("/login");
    }
  }


  return Promise.reject(error);
});


export default Axios;

