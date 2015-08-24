import Axios from 'axios';
import { EventEmitter } from 'events';


class CommonService {

  constructor() {
    this.emitter = new EventEmitter();
  }

  api(url) {
    return "/api" + url;
  }

  formatId(...args) {
    return args.join('_');
  }

}

export default new CommonService();

