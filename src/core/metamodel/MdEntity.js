import _ from 'lodash';


export default class MdEntity {

  constructor () {
    // entityKey
    this.id = null;

    // objekt (mapa) (fieldName -> MdField)
    this.fields = null;

    // list of lovItems for this entity (e.g. Country has list of countries: [{id:'CZ','Czech Republic'},...]
    this.lovItems = null;
  }



  getField(fieldName) {
    return this.fields[fieldName];
  }


}

