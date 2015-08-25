import Axios from 'core/common/config/axios-config';


class SecurityService  {


  login(username, password) {
    return Axios.get('/core/security/current-user', {
      headers: {
        authorization: "Basic " + btoa(username + ":" + password)
      }
    });
  }

  logout() {
    return Axios.post('/core/security/logout');
  }

  getCurrentUser() {
    console.log('Getting current user');
    return Axios.get('/core/security/current-user').then((response) => {
      return response.data;
    }, (error) => {
      if (error.status === 401) {
        console.log('Not authenticated - 401 from getCurrentUser()');
        return null;
      } else {
        throw error;
      }
    })
  }

}

export default new SecurityService();

