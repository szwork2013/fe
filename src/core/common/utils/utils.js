

export default class Utils {

  static formatId(...args) {
    return args.join('_');
  }

  static parseId(id) {
    return id.split('_');
  }


}

