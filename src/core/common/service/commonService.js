import { EventEmitter } from 'events';


class CommonService {

  constructor() {
    this.emitter = new EventEmitter();
  }

  emit(event, ...params) {
    this.emitter.emit(event, params);
  }

  loading(isOn) {
    this.emit("LOADING", isOn);
  }



  toastSuccess(content) {
    this.toastr.success(
      content,
      null, {
        tapToDismiss: true,
        showAnimation: 'animated fadeIn',
        hideAnimation: '',
        positionClass: 'toast-bottom-right',
        className: 'toast-bottom-right',
        //hideDuration: 1000,
        timeOut: 3000,
        extendedTimeOut: 1000
      });
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

