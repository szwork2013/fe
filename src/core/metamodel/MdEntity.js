import _ from 'lodash';


export default class MdEntity {

  constructor () {
    // entityKey
    this.id = null;

    // objekt (mapa) (fieldName -> MdField)
    this.fields = null;
  }



  getField(fieldName) {
    return this.fields[fieldName];
  }


}

