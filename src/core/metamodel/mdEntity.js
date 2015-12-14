import _ from 'lodash';


export default class MdEntity {

  constructor () {
    // entityName
    this.id;

    // objekt (mapa) (fieldName -> MdField)
    this.fields;

    // list of lovItems for this entity (e.g. Country has list of countries: [{id:'CZ','Czech Republic'},...]
    this.lovItems;
  }

  getLovItem(id) {
    return this.lovItems.find(lov => lov.value === id);
  }



  getField(fieldName) {
    return this.fields[fieldName];
  }


}

