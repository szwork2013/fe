import Axios from 'axios';

console.debug('axios init');

// Add a request interceptor
  Axios.interceptors.request.use((config) => {
    // Do something before request is sent
    if (!config.headers) config.headers = {};
    config.headers['X-Requested-With'] = 'XMLHttpRequest';

    if (!config.url.startsWith("/api")) config.url = '/api' + config.url;

    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

export default Axios;
