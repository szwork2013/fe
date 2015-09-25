import _ from 'lodash';

import GridConfig from 'core/grid/domain/gridConfig';

export default class Grid {

  constructor (gridLocation, gridConfigs) {
    // string gridLocation
    this.gridLocation = gridLocation;

    // array of GridConfig
    this.gridConfigs = gridConfigs;

    // navratova hodnota Grid ze serveru
    this.data = null;

    // reference na MdEntity
    this.$entityRef = null;

    // pole sirek sloupcu, spocitane na zaklade aktivniho gridConfigu a dat
    this.gridWidths = null;

    if (gridConfigs && gridConfigs.length > 0) {
      this.entityName = gridConfigs[0].entity;
      for(let gc of gridConfigs) {
        Object.setPrototypeOf(gc, GridConfig.prototype);
        gc.$gridRef = this;
      }
    }

    // searchTerm
    this.searchTerm = null;

    // vybrany gridConfig
    this.activeGridConfig = null;

    // aktualni [{field: MdField, desc: false/true}, ....]
    this.sortArray = null;

  }


  getGridConfig(gridId) {
    return _(this.gridConfigs).find(gc => gc.gridId == gridId);
  }

  deleteGridConfig(gridId) {
    _.remove(this.gridConfigs, gc => gc.gridId == gridId);
  }

  /**
   * Vrati aktivni gridConfig, pokud je zadany gridId, zkousi hledat ten
   * @param gridId -nepovinny paramter
     */
  getActiveGridConfig(gridId) {
    let agc;
    if (gridId) {
      agc = _(this.gridConfigs).find(gc => gc.gridId == gridId);
    }

    if (!agc) {
      agc = _.first(this.gridConfigs.filter(gc => gc.defaultGrid));
    }

    if (!agc) {
      agc = _.first(this.gridConfigs);
    }

    return agc;
  }

  get activeGridWidths() {
    return (this.gridWidths) ? this.gridWidths : this.activeGridConfig.gridWidths;
  }


  get sort() {
    return (this.sortArray) ? this.sortArray.map(o => o.field.fieldName + ((o.desc)? "_DESC" : "_ASC") ) : null;
  }

  set sort(sortValue) {
    if (sortValue) {
      if (_.isString(sortValue)) {
        sortValue = [sortValue];
      }
      this.sortArray = sortValue.map(str => {
        let split = str.split('_');
        return {field: this.$entityRef.fields[split[0]], desc: (split[1] === 'DESC') };
      });
    } else {
      this.sortArray = [];
    }
  }


  reset() {
    this.data = null;
    this.gridWidths = null;
    this.searchTerm = null;
    this.activeGridConfig = null;
    this.sortArray = null;
  }




}
