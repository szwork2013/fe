

export default class Utils {

  static formatId(...args) {
    return args.join('_');
  }

  /**
   * Parse id into string array<br>
   *     e.g. 'Party_fullName' => ['Party', 'fullName']
   * @param id
   * @returns {*|Array}
     */
  static parseId(id) {
    return id.split('_');
  }


  static writeCookie(name, value, days) {
    let expires;

    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
    }
    else {
      expires = "";
    }

    document.cookie = name + "=" + value + expires + "; path=/";
  }


  static getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1);
      if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
  }


}

