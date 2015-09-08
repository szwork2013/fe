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
      this.entityKey = gridConfigs[0].entity;
      for(let gc of gridConfigs) {
        Object.setPrototypeOf(gc, GridConfig.prototype);
      }
    }

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




}
