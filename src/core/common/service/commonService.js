import { EventEmitter } from 'events';


class CommonService {

  constructor() {
    this.emitter = new EventEmitter();
  }



}

export default new CommonService();

