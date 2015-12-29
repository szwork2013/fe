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

  getLovItemLabel(id) {
    let lov = this.getLovItem(id);
    return (lov) ? lov.label : undefined;
  }


  getField(fieldName) {
    return this.fields[fieldName];
  }

}

