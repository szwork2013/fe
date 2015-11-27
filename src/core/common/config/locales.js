import _ from 'lodash';
import moment from 'moment';
import cs from 'moment/locale/cs';
import sk from 'moment/locale/sk';
import de from 'moment/locale/de';
import hu from 'moment/locale/hu';
import pl from 'moment/locale/pl';

import momentLocalizer from 'react-widgets/lib/localizers/moment';


import Utils from 'core/common/utils/utils';


momentLocalizer(moment);


class Locales {

  constructor() {
    this.available = ['en', 'cs', 'sk', 'de', 'hu', 'pl'];
    this._lang = null;
  }

  get lang() {
    if (!this._lang) {
      this._lang = this._resolveLang();
      moment.locale(this._lang);
    }
    return this._lang;
  }

  set lang(_l) {
    if (_.includes(this.available, _l)) {
      this._lang = _l;
      Utils.writeCookie('lang', _l, 365);
      moment.locale(_l);
    }
  }

  /**
   * Nejdriv to zkusim vzit z cookie
   * @returns {*}
   * @private
     */
  _resolveLang() {
    console.debug('resolving lang ');


    let _l = Utils.getCookie('lang');
    if (_l) {
      if (_.includes(this.available, _l)) {
        return _l;
      }
    }
    let nav = window.navigator;
    let locale = nav.language || nav.browserLanguage || nav.systemLanguage || nav.userLanguage || '';
    _l = locale.slice(0, 2);
    if (_.includes(this.available, _l)) {
      return _l;
    } else {
      return 'en';
    }
  }


}

export default new Locales();
