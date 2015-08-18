import Axios from 'core/common/config/axios-config';
import ServiceAncestor from 'core/common/service/serviceAncestor';

class SecurityService extends ServiceAncestor {


  login(username, password) {
    return Axios.get(this.api('/core/security/current-user'), {
      headers: {
        authorization: "Basic " + btoa(username + ":" + password)
      }
    });
  }

  logout() {
    return Axios.get(this.api('/core/security/logout'));
  }

  getCurrentUser() {
    console.log('Getting current user');
    return Axios.get(this.api('/core/security/current-user')).then((response) => {
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

