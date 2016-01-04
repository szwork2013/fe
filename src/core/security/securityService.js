import Axios from 'core/common/config/axios-config';
import {store} from 'core/common/redux/store';

class SecurityService  {


  login(username, password, tenantId) {
    return Axios.get('/core/security/current-user', {
      headers: {
        authorization: "Basic " + btoa(username + ":" + password),
        tenantId: tenantId
      }
    });
  }

  logout() {
    return Axios.post('/core/security/logout');
  }

  readCurrentUser() {
    console.log('Reading current user');
    return Axios.get('/core/security/current-user').then((response) => {
      return response.data;
    }, (error) => {
      if (error.status === 401) {
        console.log('Not authenticated - 401 from readCurrentUser()');
        return null;
      } else {
        throw error;
      }
    })
  }

  getCurrentUser() {
    return store.getState().getIn(['security', 'currentUser']);
  }



  getTenants(username) {
    return Axios.get('/public/tenant', {
      params: {username}
    }).then(response => response.data);
  }

  readUser(username) {
    return Axios.get('/core/security/user/' + username)
      .then(response => response.data);
  }

  userExist(username) {
    return Axios.get('/core/security/user-exist/' + username)
      .then(response => response.data);
  }

  userCreate(user) {
    return Axios.put('/core/security/user', user)
      .then((response) => response.data);
  }
  userUpdate(user) {
    return Axios.post('/core/security/user', user)
      .then((response) => response.data);
  }

  deleteUser(username) {
    return Axios.delete('/core/security/user/' + username, {showPrettyError: true});
  }

}

export default new SecurityService();

