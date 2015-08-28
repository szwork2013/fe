import Axios from 'axios';
import Locales from 'core/common/config/locales';

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



    if (!config.url.startsWith("/api")) config.url = '/api' + config.url;

    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

export default Axios;
