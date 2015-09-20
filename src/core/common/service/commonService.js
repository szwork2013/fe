import { EventEmitter } from 'events';


class CommonService {

  constructor() {
    this.emitter = new EventEmitter();
  }

  get toastr() {
    return this._toastr;
  }

  set toastr(toastr) {
    this._toastr = toastr;
  }

  get router() {
    return this._router;
  }

  set router(router) {
    this._router = router;
  }

}

export default new CommonService();

