import Axios from 'axios';
import { EventEmitter } from 'events';

import ServiceAncestor from 'core/common/service/serviceAncestor';

class CommonService extends ServiceAncestor {

  constructor() {
    super();
    this.emitter = new EventEmitter();
  }

}

export default new CommonService();

